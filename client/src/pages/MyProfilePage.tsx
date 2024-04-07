// MyProfilePage.tsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserDetails, selectCurrentUserDetails } from '../features/auth/authSlice';
import { fetchUserCars, selectUserCars } from '../features/cars/carSlice';
import { AppDispatch } from '../app/store';
import CarCard from '../components/CarCard';

const MyProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userDetails = useSelector(selectCurrentUserDetails);
  const userCars = useSelector(selectUserCars);

  useEffect(() => {
    dispatch(fetchUserDetails());
    dispatch(fetchUserCars());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div>
        <h2 className="text-xl font-semibold">User Details</h2>
        <p>ID: {userDetails?.username}</p>
        <p>Email: {userDetails?.email}</p>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">My Car Listings</h2>
        {userCars.length > 0 ? (
          <ul>
            {userCars.map((car) => (
              <CarCard key={car._id?.toString()} carData={car} />
            ))}
          </ul>
        ) : (
          <p>You have no car listings.</p>
        )}
      </div>
    </div>
  );
};

export default MyProfilePage;
