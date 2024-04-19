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
import {
  fetchUserChatSessions,
  selectChatSessions,
} from "../features/chat/chatSlice"; // Import chat actions and selectors
import CarCard from "../components/CarCard";
import ChatCard from "../components/ChatCard"; // Make sure to import ChatCard
import { FaUserAlt } from "react-icons/fa";
import { AppDispatch } from "../app/store";

const MyProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userDetails = useSelector(selectCurrentUserDetails);
  const userCars = useSelector(selectUserCars);
  const chatSessions = useSelector(selectChatSessions); // Get chat sessions from state
  const year =
    userDetails && userDetails.createdAt
      ? new Date(userDetails.createdAt).getFullYear()
      : "N/A";

  useEffect(() => {
    dispatch(fetchCurrentUserDetails());
    dispatch(fetchUserCars());
    dispatch(fetchUserChatSessions()); // Fetch chat sessions
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteCarListing(id));
  };

  console.log(chatSessions);

  return (
    <div className="container mx-auto px-4 py-10 mt-10 bg-white shadow-lg rounded-lg">
      <header className="text-center">
        <FaUserAlt className="w-24 h-24 mx-auto text-gray-700" />
        <h1 className="text-4xl font-bold text-gray-800 mt-2">
          {userDetails?.username}
        </h1>
        <p className="text-gray-600">Member since {year}</p>
      </header>

      <section className="mt-10">
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            User Details
          </h2>
          <div className="border p-6 rounded-lg shadow-sm bg-gray-50">
            <p className="mb-2">
              <span className="font-medium">Email:</span> {userDetails?.email}
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            My Car Listings
          </h2>
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

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Chats</h2>
          <div>
            {chatSessions.length > 0 ? (
              chatSessions.map((session) => (
                <ChatCard key={session.roomId} chatSession={session} />
              ))
            ) : (
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
