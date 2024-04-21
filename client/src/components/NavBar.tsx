import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { selectCurrentUserDetails, selectIsLoggedIn } from "../features/auth/authSlice";
import * as authService from "../features/auth/authService";
import { setLoggedIn } from "../features/auth/authSlice";

const Navbar = () => {
  const [nav, setNav] = useState<boolean>(false);
  const isLoggedIn = useSelector(selectIsLoggedIn); // Use Redux state
  const userDetails = useSelector(selectCurrentUserDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogoutClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await authService.logout();
      dispatch(setLoggedIn(false));
      setNav(false);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-30 bg-black bg-opacity-90 backdrop-blur-md shadow-lg">
        <div className="flex justify-between items-center h-16 max-w-[1240px] mx-auto px-4 text-white">
          <Link to="/" className="text-4xl font-bold text-indigo-500 hover:text-indigo-300 transition duration-300">
            CRUZR
          </Link>
          <ul className={`flex items-center ${isLoggedIn ? "space-x-2" : "space-x-4"} hidden md:flex`}>
            <li>
              <Link to="/cars" className="hover:text-indigo-500 transition duration-300 pr-4 border-r-2 border-indigo-500/50">Cars</Link>
            </li>
            {!isLoggedIn ? (
              <>
                <li>
                  <Link to="/login" className="hover:text-indigo-500 transition duration-300 pr-4 border-r-2 border-indigo-500/50">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-indigo-500 transition duration-300 ">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/myprofile" className="hover:text-indigo-500 transition duration-300 pr-4 pl-2 border-r-2 border-indigo-500/50">My Profile ({userDetails?.username})</Link>
                </li>
                <li>
                  <Link to="/createlisting" className="hover:text-indigo-500 transition duration-300 pr-4 pl-2 border-r-2 border-indigo-500/50">Create Listing</Link>
                </li>
                <li>
                  <button onClick={handleLogoutClick} className="text-white hover:text-indigo-500 transition duration-300 pl-2">Logout</button>
                </li>
              </>
            )}
          </ul>
          <div onClick={handleNav} className="md:hidden cursor-pointer">
            {!nav ? <AiOutlineMenu size={25} className="text-white" /> : <AiOutlineClose size={25} className="text-white" />}
          </div>
        </div>
        {nav && (
          <div className="absolute left-0 w-full bg-black bg-opacity-95 mt-4 md:hidden">
            <ul className="text-center py-8">
              <li className="py-4 mx-32 border-b-2 border-indigo-500/50">
                <Link to="/cars" className="text-white hover:text-indigo-500 transition duration-300" onClick={() => setNav(false)}>Cars</Link>
              </li>
              {!isLoggedIn ? (
                <>
                  <li className="py-4 mx-32 border-b-2 border-indigo-500/50">
                    <Link to="/login" className="text-white hover:text-indigo-500 transition duration-300" onClick={() => setNav(false)}>Login</Link>
                  </li>
                  <li className="py-4 mx-32">
                    <Link to="/register" className="text-white hover:text-indigo-500 transition duration-300" onClick={() => setNav(false)}>Register</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="py-4 mx-32 border-b-2 border-indigo-500/50">
                    <Link to="/myprofile" className="text-white hover:text-indigo-500 transition duration-300" onClick={() => setNav(false)}>My Profile ({userDetails?.username})</Link>
                  </li>
                  <li className="py-4 mx-32 border-b-2 border-indigo-500/50">
                    <Link to="/createlisting" className="text-white hover:text-indigo-500 transition duration-300" onClick={() => setNav(false)}>Create Listing</Link>
                  </li>
                  <li className="py-4">
                    <button onClick={handleLogoutClick} className="text-white hover:text-indigo-500 transition duration-300">Logout</button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
      <div className="h-16 bg-gray-900"></div> {/* Placeholder for spacing */}
    </>
  );
};

export default Navbar;
