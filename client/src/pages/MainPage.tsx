import React, { useState, useEffect } from "react";
import CarCard from "../components/CarCard";
import { CarData } from "../types/car";
import axios from "axios"; // Import Axios

const MainPage: React.FC = () => {
    const [cars, setCars] = useState<CarData[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await axios.get("http://localhost:3000/api/cars");
          
          // Map over the fetched data and adjust the `make` field
          const transformedCars = result.data.map((car: any) => ({
            ...car,
            make: car.make.make, // Simplify the make structure
          }));
  
          setCars(transformedCars);
        } catch (error) {
          console.error('Error fetching cars:', error);
        }
      };
  
      fetchData();
    }, []); // Empty dependency array: Fetch data once on component mount
  
  return (
    <div className="">
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {cars.map((car) => (
          <CarCard key={car._id?.toString()} carData={car} /> // Convert to string
        ))}
      </div>
    </div>
  );
};

export default MainPage;
