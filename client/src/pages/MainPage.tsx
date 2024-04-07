import React, { useState, useEffect } from "react";
import CarCard from "../components/CarCard";
import { CarData } from "../types/car";
import axios from "axios";

const MainPage: React.FC = () => {
    const [cars, setCars] = useState<CarData[]>([]);
    const [filter, setFilter] = useState({ make: '', model: '', year: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const query = new URLSearchParams(filter).toString();
                const result = await axios.get(`http://localhost:3000/api/cars?${query}`);

                setCars(result.data);
                console.log(result.data)
            } catch (error) {
                console.error('Error fetching cars:', error);
            }
        };

        fetchData();
    }, [filter]); // Dependency on filter: Fetch data on filter change

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilter(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="">
            <div className="filter-form p-4">
                <select name="make" value={filter.make} onChange={handleChange}>
                    <option value="">Select Make</option>
                    {/* Populate these options based on available makes */}
                </select>
                <input
                    type="text"
                    name="model"
                    value={filter.model}
                    placeholder="Model"
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="year"
                    value={filter.year}
                    placeholder="Year"
                    onChange={handleChange}
                />
            </div>
            <div className="flex flex-wrap justify-center gap-4 p-4">
                {cars.map((car) => (
                    <CarCard key={car._id?.toString()} carData={car} /> // Convert to string
                ))}
            </div>
        </div>
    );
};

export default MainPage;
