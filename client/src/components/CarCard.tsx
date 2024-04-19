import { useEffect, useState } from "react";
import { CarData } from "../types/car";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import {
  fetchUserDetailsById,
  selectUserDetailsById,
  selectIsLoggedIn
} from "../features/auth/authSlice";

interface CarCardProps {
  carData: CarData;
  isInMyProfile?: boolean; // To check whether carCard is in Main or Profile
  onDelete?: (id: string) => void;
  onChatStart?: (carId: string) => void; // Optional function to start chat
  isOwner?: boolean; // Indicates if the logged-in user is the owner of the car
}

const CarCard: React.FC<CarCardProps> = ({
  carData,
  isInMyProfile,
  onDelete,
  onChatStart,
  isOwner, // Prop to check if the user is the owner of the car
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const ownerDetails = useSelector((state: RootState) => carData.user ? selectUserDetailsById(state, carData.user) : null);
  const isLoggedIn = useSelector((state: RootState) => selectIsLoggedIn(state));

  console.log('CarData User:', carData.user);

  useEffect(() => {
    // Only dispatch the action if carData.user is not undefined
    if (carData.user) {
      dispatch(fetchUserDetailsById(carData.user));
    }
  }, [carData.user, dispatch]);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % carData.images.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prevIndex) =>
        (prevIndex - 1 + carData.images.length) % carData.images.length
    );
  };

  const handleChat = () => {
    if (isLoggedIn) {
      carData._id && onChatStart && onChatStart(carData._id);
    } else {
      alert("You must be logged in to start/join a chat.");
    }
  };

  return (
    <div className="p-4 flex flex-col w-80">
      <div
        className="bg-indigo-50 rounded-lg overflow-hidden shadow-lg flex flex-col"
        style={{ minHeight: "400px" }}
      >
        {carData.images && carData.images.length > 1 ? (
          <div className="relative aspect-w-16 aspect-h-9">
            <FaChevronLeft
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-indigo-400 text-2xl hover:text-indigo-200"
              onClick={prevSlide}
            />
            <FaChevronRight
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-indigo-400 text-2xl hover:text-indigo-200"
              onClick={nextSlide}
            />
            {carData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${carData.make} ${carData.carModel}`}
                className={`w-full object-cover duration-500 ease-in-out ${
                  index === activeIndex ? "block" : "hidden"
                }`}
                style={{ height: "200px" }}
              />
            ))}
          </div>
        ) : (
          <img
            src={carData.images[0]}
            alt={`${carData.make} ${carData.carModel}`}
            className="aspect-w-16 aspect-h-9 object-cover object-center w-full"
            style={{ height: "200px" }}
          />
        )}
        <div className="px-6 py-4 flex-grow">
          <div className="font-bold text-xl mb-2">
            {carData.make} {carData.carModel} ({carData.year})
            <br />
            Owned by: {ownerDetails ? ownerDetails.username : 'Loading...'}
          </div>
          <div className="py-2 border-b-2">
            <p className="text-gray-700 text-base">
              <strong>Price:</strong> ${carData.price.toLocaleString()}
            </p>
          </div>
          <div className="py-2 border-b-2">
            <p className="text-gray-700 text-base">
              <strong>Mileage (km):</strong> {carData.mileage.toLocaleString()}
            </p>
          </div>
          <div className="flex-grow overflow-y-auto h-32">
            {carData.description && (
              <p className="text-gray-700 text-base overflow-wrap break-words">
                <strong>Description:</strong>
                {carData.description}
              </p>
            )}
          </div>
        </div>
        {isOwner ? (
          <div className="p-2 text-white bg-gray-500 rounded-b-lg text-sm text-center">
            Your Listing
          </div>
        ) : (
          <button
            onClick={handleChat}
            className="p-2 text-white bg-indigo-500 hover:bg-indigo-700 transition duration-300 rounded-b-lg text-sm"
          >
            Chat
          </button>
        )}
        {isInMyProfile && onDelete && (
          <button
            onClick={() => carData._id && onDelete?.(carData._id)}
            className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-b-lg text-sm"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default CarCard;
