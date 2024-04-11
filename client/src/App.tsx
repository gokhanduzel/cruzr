import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import CreateCarListingPage from "./pages/CreateCarListingPage";
import MyProfilePage from "./pages/MyProfilePage";
import HeroPage from "./pages/HeroPage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { verifyAuth } from "./features/auth/authSlice";
import { AppDispatch } from "./app/store";
import Footer from "./components/Footer";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(verifyAuth());
  }, [dispatch]);

  return (
    <Router>
      {/* Set flex container with minimum height of full screen */}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {/* Page content will change based on the route */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HeroPage />} />
            <Route path="/cars" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/myprofile" element={<MyProfilePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/createlisting" element={<CreateCarListingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
