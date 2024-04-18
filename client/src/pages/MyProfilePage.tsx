// MyProfilePage.tsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCurrentUserDetails,
  selectCurrentUserDetails,
} from "../features/auth/authSlice";
import {
  deleteCarListing,
  fetchUserCars,
  selectUserCars,
} from "../features/cars/carSlice";
import { fetchUserChatSessions, selectChatSessions } from "../features/chat/chatSlice"; // Import chat actions and selectors
import CarCard from "../components/CarCard";
import ChatCard from "../components/ChatCard"; // Make sure to import ChatCard
import { FaUserAlt } from "react-icons/fa";
import { AppDispatch } from "../app/store";

const MyProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userDetails = useSelector(selectCurrentUserDetails);
  const userCars = useSelector(selectUserCars);
  const chatSessions = useSelector(selectChatSessions); // Get chat sessions from state
  const year = userDetails && userDetails.createdAt ? new Date(userDetails.createdAt).getFullYear() : "N/A";

  useEffect(() => {
    dispatch(fetchCurrentUserDetails());
    dispatch(fetchUserCars());
    dispatch(fetchUserChatSessions()); // Fetch chat sessions
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteCarListing(id));
  };

  return (
    <div className="container mx-auto p-5 mt-20">
      <header className="flex flex-col items-center mb-10">
        <FaUserAlt className="w-24 h-24 rounded-full object-cover mb-4 shadow-lg" />
        <h1 className="text-3xl font-bold">{userDetails?.username}</h1>
        <p className="text-gray-600">Member since {year}</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Details</h2>
          <p className="mb-2">
            <span className="font-medium">Email:</span> {userDetails?.email}
          </p>
        </div>
        <div className="col-span-2">
          <h2 className="text-xl font-semibold mb-4">My Car Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCars.length > 0 ? userCars.map((car) => (
              <CarCard key={car._id?.toString()} carData={car} onDelete={handleDelete} isInMyProfile={true} />
            )) : (
              <div className="p-5 bg-gray-100 rounded-md text-center">
                <p>You have no car listings yet.</p>
              </div>
            )}
          </div>
          <h2 className="text-xl font-semibold mb-4">My Chats</h2>
          <div>
            {chatSessions.length > 0 ? chatSessions.map(session => (
              <ChatCard key={session.roomId} chatSession={session} />
            )) : (
              <div className="p-5 bg-gray-100 rounded-md text-center">
                <p>No active chats.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyProfilePage;