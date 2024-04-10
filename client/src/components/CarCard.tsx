import React from "react";
import { CarData } from "../types/car";

interface CarCardProps {
  carData: CarData;
}

const CarCard: React.FC<CarCardProps> = ({ carData }) => {
  return (
    // Use TailwindCSS classes for a fixed height and maximum width
    <div className="p-4 flex flex-col w-80">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg flex flex-col" style={{ minHeight: '400px' }}>
        <div className="aspect-w-16 aspect-h-9">
          {carData.images && carData.images.length > 0 && (
            // Set a fixed height for the image
            <img
              src={carData.images[0]}
              alt={`${carData.make} ${carData.carModel}`}
              className="object-cover object-center w-full"
              style={{ height: '200px' }} // Adjust the height as needed
            />
          )}
        </div>
        <div className="px-6 py-4 flex-grow">
          <div className="font-bold text-xl mb-2">{carData.make} {carData.carModel} ({carData.year})</div>
          <p className="text-gray-700 text-base">
            <strong>Price:</strong> ${carData.price.toLocaleString()}
          </p>
          <p className="text-gray-700 text-base">
            <strong>Mileage:</strong> {carData.mileage.toLocaleString()} miles
          </p>
          {/* Ensure description does not push content */}
          <div className="mt-4 flex-grow">
            {carData.description && (
              <p className="text-gray-700 text-base">{carData.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
