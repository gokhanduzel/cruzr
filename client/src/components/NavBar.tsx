import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { selectIsLoggedIn } from "../features/auth/authSlice";
import * as authService from "../features/auth/authService";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "../features/auth/authSlice";

const Navbar = () => {
  const [nav, setNav] = useState<boolean>(false);
  const isLoggedIn = useSelector(selectIsLoggedIn); // Use Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogoutClick = async (e: React.MouseEvent) => {
    // Adjusted type here
    e.preventDefault();
    try {
      await authService.logout();
      dispatch(setLoggedIn(false));
      setNav(false);
      navigate('/');
    } catch (error) {
      console.error(error);
      // Consider displaying an error message to the user
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-30">
        <div className="flex justify-between items-center h-24 max-w-[1240px] w-full mx-auto px-4 text-white bg-black">
          <Link to="/" className="text-4xl font-bold text-white">
            CRUZR
          </Link>
          {/* Conditionally render menu based on isLoggedIn */}
          <ul
            className={`hidden md:flex ${
              isLoggedIn ? "space-x-4" : "space-x-10"
            }`}
          >
            <li className="p-4">
              <Link to="/" className="text-white">
                Cars
              </Link>
            </li>
            {!isLoggedIn ? (
              <>
                <li className="p-4">
                  <Link to="/login" className="text-white">
                    Login
                  </Link>
                </li>
                <li className="p-4">
                  <Link to="/register" className="text-white">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="p-4">
                  <Link to="/myprofile" className="text-white">
                    My Profile
                  </Link>
                </li>
                <li className="p-4">
                  <Link to="/createlisting" className="text-white">
                    Create Listing
                  </Link>
                </li>
                <li className="p-4">
                  <button className="text-white" onClick={handleLogoutClick}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
          {/* Hamburger icon */}
          <div onClick={handleNav} className="md:hidden">
            {!nav ? (
              <AiOutlineMenu size={25} className="text-white" />
            ) : (
              <AiOutlineClose size={25} className="text-white" />
            )}
          </div>
        </div>
        {/* Dropdown menu */}
        {nav && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-24 w-[60%] bg-black bg-opacity-50 mt-4 rounded-xl backdrop-blur-xl md:hidden">
            <ul className="uppercase text-center p-6">
              <li className="p-4 border-b border-gray-600">
                <Link
                  to="/"
                  className="text-white"
                  onClick={() => setNav(false)}
                >
                  Cars
                </Link>
              </li>
              {!isLoggedIn ? (
                <>
                  <li className="p-4 border-b border-gray-600">
                    <Link
                      to="/login"
                      className="text-white"
                      onClick={() => setNav(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li className="p-4 border-b border-gray-600">
                    <Link
                      to="/register"
                      className="text-white"
                      onClick={() => setNav(false)}
                    >
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="p-4 border-b border-gray-600">
                    <Link
                      to="/myprofile"
                      className="text-white"
                      onClick={() => setNav(false)}
                    >
                      My Profile
                    </Link>
                  </li>
                  <li className="p-4">
                    <button className="text-white" onClick={handleLogoutClick}>
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
      <div className="h-24"></div>
    </>
  );
};

export default Navbar;
