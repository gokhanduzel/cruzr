import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CarCard from "../components/CarCard";
import { CarMakeModelData } from "../types/carMakeModel";
import { fetchCarsWithFilters, selectAllCars } from "../features/cars/carSlice";
import axios from "axios";
import { AppDispatch } from "../app/store";

const MainPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const cars = useSelector(selectAllCars);
    const [carMakeModels, setCarMakeModels] = useState<CarMakeModelData[]>([]);
    const [selectedMake, setSelectedMake] = useState<string>('');
    const [filter, setFilter] = useState({
        make: '',
        model: '',
        yearMin: '',
        yearMax: '',
        mileageMin: '',
        mileageMax: '',
        priceMin: '',
        priceMax: ''
    });

    useEffect(() => {
        dispatch(fetchCarsWithFilters({})); // Fetch all cars initially
    }, [dispatch]);

    useEffect(() => {
        const fetchCarMakeModels = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/makemodel/carmakemodel");
                setCarMakeModels(response.data);
            } catch (error) {
                console.error("Error fetching car makes and models:", error);
            }
        };
        fetchCarMakeModels();
    }, []);

    const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const make = e.target.value;
        setSelectedMake(make);
        setFilter(prev => ({ ...prev, make: make, model: '' }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilter(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
        dispatch(fetchCarsWithFilters(filter));
    };

    const modelsForSelectedMake = carMakeModels.find(makeModel => makeModel.make === selectedMake)?.models || [];

    return (
        <div>
            <div className="filter-form p-4">
                <select name="make" value={filter.make} onChange={handleMakeChange}>
                    <option value="">Select Make</option>
                    {carMakeModels.map((makeModel) => (
                        <option key={makeModel._id} value={makeModel.make}>{makeModel.make}</option>
                    ))}
                </select>
                <select name="model" value={filter.model} onChange={handleChange} disabled={!selectedMake}>
                    <option value="">Select Model</option>
                    {modelsForSelectedMake.map((model, index) => (
                        <option key={index} value={model}>{model}</option>
                    ))}
                </select>
                <input type="number" name="yearMin" value={filter.yearMin} placeholder="Year Min" onChange={handleChange} />
                <input type="number" name="yearMax" value={filter.yearMax} placeholder="Year Max" onChange={handleChange} />
                <input type="number" name="mileageMin" value={filter.mileageMin} placeholder="Mileage Min" onChange={handleChange} />
                <input type="number" name="mileageMax" value={filter.mileageMax} placeholder="Mileage Max" onChange={handleChange} />
                <input type="number" name="priceMin" value={filter.priceMin} placeholder="Price Min" onChange={handleChange} />
                <input type="number" name="priceMax" value={filter.priceMax} placeholder="Price Max" onChange={handleChange} />
                <button onClick={handleApplyFilters} className="ml-4 py-2 px-4 bg-blue-500 text-white rounded">Apply Filters</button>
            </div>
            <div className="flex flex-wrap justify-center gap-4 p-4">
                {cars.map((car) => (
                    <CarCard key={car._id?.toString()} carData={car} />
                ))}
            </div>
        </div>
    );
};

export default MainPage;
