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

const MyProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userDetails = useSelector(selectCurrentUserDetails);
  const userCars = useSelector(selectUserCars);

  useEffect(() => {
    dispatch(fetchUserDetails());
    dispatch(fetchUserCars());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteCarListing(id));
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div>
        <h2 className="text-xl font-semibold">User Details</h2>
        <div className="ml-4 mt-4">
          <p>Username: {userDetails?.username}</p>
          <p>Email: {userDetails?.email}</p>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">My Car Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-4">
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
            <p>You have no car listings.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
