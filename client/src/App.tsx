import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import CreateCarListingPage from "./pages/CreateCarListingPage";
import MyProfilePage from "./pages/MyProfilePage";
import HeroPage from "./pages/HeroPage";
import ModalManager from "./components/ModalManager";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUserDetails,
  selectIsLoggedIn,
  verifyAuth,
  selectAccessToken,
  fetchToken,
} from "./features/auth/authSlice";
import { initiateSocketConnection } from './features/socket/socketServices'; // Adjust import as necessary
import { AppDispatch } from "./app/store";
import Footer from "./components/Footer";
import { Socket } from 'socket.io-client';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const socketRef = useRef<Socket | null>(null);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const accessToken = useSelector(selectAccessToken); // Access the accessToken from the state

  useEffect(() => {
    dispatch(verifyAuth()).then(() => {
      if (isLoggedIn) {
        dispatch(fetchCurrentUserDetails());
        dispatch(fetchToken());
      }
    });
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (accessToken) {
      socketRef.current = initiateSocketConnection(accessToken); // Initiate and store the socket connection
    }

    return () => {
      // Proper cleanup when the component unmounts or accessToken changes
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [accessToken]); // This effect runs whenever there is a valid token

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HeroPage />} />
            <Route path="/cars" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/myprofile" element={<MyProfilePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/createlisting" element={<CreateCarListingPage />} />
          </Routes>
          <ModalManager />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
