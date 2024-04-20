import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CarCard from "../components/CarCard";
import { CarMakeModelData } from "../types/carMakeModel";
import { fetchCarsWithFilters, selectAllCars } from "../features/cars/carSlice";
import { openModal } from "../features/modal/modalSlice";
import axios from "axios";
import { AppDispatch } from "../app/store";
import { FaCircleChevronUp, FaCircleChevronDown } from "react-icons/fa6";
import { selectCurrentUserDetails } from "../features/auth/authSlice";

const MainPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cars = useSelector(selectAllCars);
  const currentUserDetails = useSelector(selectCurrentUserDetails); // Get current user details
  const [carMakeModels, setCarMakeModels] = useState<CarMakeModelData[]>([]);
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState({
    make: "",
    model: "",
    yearMin: "",
    yearMax: "",
    mileageMin: "",
    mileageMax: "",
    priceMin: "",
    priceMax: "",
  });

  useEffect(() => {
    dispatch(fetchCarsWithFilters({})); // Fetch all cars initially
  }, [dispatch]);

  useEffect(() => {
    const fetchCarMakeModels = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/makemodel/carmakemodel`
        );
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
    setFilter((prev) => ({ ...prev, make: make, model: "" }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    dispatch(fetchCarsWithFilters(filter));
  };

  const handleChatStart = (carId: string) => {
    dispatch(openModal({ content: "chat", carId: carId }));
  };

  const modelsForSelectedMake =
    carMakeModels.find((makeModel) => makeModel.make === selectedMake)
      ?.models || [];

  const toggleFilters = () => setShowFilters((prev) => !prev);

  return (
    <div className="relative">
      <div
        className={`${
          showFilters ? "block" : "hidden"
        } bg-white shadow-md rounded-lg p-6 mb-4`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <select
            name="make"
            value={filter.make}
            onChange={handleMakeChange}
            className="block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Make</option>
            {carMakeModels.map((makeModel) => (
              <option key={makeModel._id} value={makeModel.make}>
                {makeModel.make}
              </option>
            ))}
          </select>
          <select
            name="model"
            value={filter.model}
            onChange={handleChange}
            disabled={!selectedMake}
            className="block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Model</option>
            {modelsForSelectedMake.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="yearMin"
            value={filter.yearMin}
            onChange={handleChange}
            placeholder="Year Min"
            className="p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            name="yearMax"
            value={filter.yearMax}
            onChange={handleChange}
            placeholder="Year Max"
            className="p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            name="mileageMin"
            value={filter.mileageMin}
            onChange={handleChange}
            placeholder="Mileage Min"
            className="p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            name="mileageMax"
            value={filter.mileageMax}
            onChange={handleChange}
            placeholder="Mileage Max"
            className="p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            name="priceMin"
            value={filter.priceMin}
            onChange={handleChange}
            placeholder="Price Min"
            className="p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            name="priceMax"
            value={filter.priceMax}
            onChange={handleChange}
            placeholder="Price Max"
            className="p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="col-span-1 sm:col-span-2 md:col-span-4 flex justify-end">
          <button
            onClick={handleApplyFilters}
            className="mt-2 py-2 px-4 bg-indigo-500 hover:bg-indigo-700 transition duration-300 text-white font-bold rounded  "
          >
            Apply Filters
          </button>
        </div>
      </div>
      {/* Toggle Button */}
      <div className="flex justify-center items-center -mt-6 z-10">
        <button
          onClick={toggleFilters}
          className={`absolute mb-[-2rem] bg-indigo-500 hover:bg-indigo-700 transition duration-300 text-white p-2 ${
            showFilters ? "rounded-full" : "rounded-b-lg"
          }`}
        >
          {showFilters ? (
            <FaCircleChevronUp size={24} />
          ) : (
            <div className="flex flex-col justify-center items-center">
              <FaCircleChevronDown size={24} className="mt-20" />
              <p className="pt-2">Apply Filters</p>
            </div>
          )}
        </button>
      </div>

      {/* Car listing display area */}
      <div className="flex flex-wrap justify-center gap-4 pt-32 pb-10">
        {cars.length > 0 ? (
          cars.map((car) => (
            <CarCard
              key={car._id?.toString()}
              carData={car}
              onChatStart={() => car._id && handleChatStart(car._id)}
              isOwner={
                currentUserDetails ? car.user === currentUserDetails._id : false
              }
            />
          ))
        ) : (
          <div className="w-full text-center text-gray-600 text-xl">
            <p>
              No car listings found. Try adjusting your filters or check back
              later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
