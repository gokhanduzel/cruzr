import { useEffect } from "react";
import { Link } from "react-router-dom";
import  Civic  from "../assets/carImage.png"

const HeroPage = () => {
  useEffect(() => {
    // When the component mounts, disable scrolling
    document.body.classList.add("overflow-hidden");

    // When the component unmounts, re-enable scrolling
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className=" bg-indigo-800 text-white h-screen flex flex-col justify-center items-center text-center px-4 md:px-0">
      <img src={Civic} alt="red_civic_image" className="w-96"/>
      <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl mb-6">
        Find Your Dream Car
      </h1>
      <p className="text-xl md:text-2xl lg:text-3xl max-w-3xl mb-8">
        Explore a wide range of vehicles from classics to modern supercars. Your
        perfect ride awaits.
      </p>
      <Link
        to="/cars"
        className="py-3 px-8 mb-32 bg-indigo-500 hover:bg-orange-400 transition duration-300 ease-in-out rounded-lg text-xl font-semibold shadow-lg"
      >
        Browse Listings
      </Link>
    </div>
  );
};

export default HeroPage;
