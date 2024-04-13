// MyProfilePage.tsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserDetails,
  selectCurrentUserDetails,
} from "../features/auth/authSlice";
import {
  deleteCarListing,
  fetchUserCars,
  selectUserCars,
} from "../features/cars/carSlice";
import { AppDispatch } from "../app/store";
import CarCard from "../components/CarCard";
import { FaUserAlt } from "react-icons/fa";

const MyProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userDetails = useSelector(selectCurrentUserDetails);
  const userCars = useSelector(selectUserCars);
  const year =
    userDetails && userDetails.createdAt
      ? new Date(userDetails.createdAt).getFullYear()
      : "N/A";

  useEffect(() => {
    dispatch(fetchUserDetails());
    dispatch(fetchUserCars());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteCarListing(id));
  };

  return (
    <div className="container mx-auto p-5 mt-20">
      <header className="flex flex-col items-center mb-10">
        {" "}
        {/* Profile Header */}
        <FaUserAlt className="w-24 h-24 rounded-full object-cover mb-4 shadow-lg" />
        <h1 className="text-3xl font-bold">{userDetails?.username}</h1>
        <p className="text-gray-600">Member since {year}</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {" "}
        {/* Main Content */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {" "}
          {/* User Details */}
          <h2 className="text-xl font-semibold mb-4">User Details</h2>
          <p className="mb-2">
            <span className="font-medium">Email:</span> {userDetails?.email}
          </p>
        </div>
        <div className="col-span-2">
          {" "}
          {/* Car Listings */}
          <h2 className="text-xl font-semibold mb-4">My Car Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCars.length > 0 ? (
              userCars.map((car) => (
                <CarCard
                  key={car._id?.toString()}
                  carData={car}
                  onDelete={handleDelete}
                  isInMyProfile={true}
                />
              ))
            ) : (
              <div className="p-5 bg-gray-100 rounded-md text-center">
                <p>You have no car listings yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyProfilePage;
