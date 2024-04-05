import React from 'react'; 
import { CarData } from '../types/car';

interface CarCardProps {
  carData: CarData;
}

const CarCard: React.FC<CarCardProps> = ({ carData }) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:border-gray-700">
      {/* Image Handling */}
      {carData.images && carData.images.length > 0 && (
        <img src={carData.images[0]} alt={carData.carModel} className="w-full" /> 
      )}

      <div className="card-content">
        <h3>{carData.make} {carData.carModel} ({carData.year})</h3> 
        <p><strong>Price:</strong> ${carData.price}</p>
        <p><strong>Mileage:</strong> {carData.mileage.toLocaleString()}</p> 
        {carData.description && <p>{carData.description}</p>} {/* Display description if it exists */}
      </div>
    </div>
  );
};

export default CarCard;
