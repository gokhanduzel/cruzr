import { Link } from 'react-router-dom';

const HeroPage = () => {
  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col justify-center items-center text-center px-4 md:px-0">
      <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl mb-6">
        Find Your Dream Car
      </h1>
      <p className="text-xl md:text-2xl lg:text-3xl max-w-3xl mb-8">
        Explore a wide range of vehicles from classics to modern supercars. Your perfect ride awaits.
      </p>
      <Link to="/cars" className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 transition duration-300 ease-in-out rounded-lg text-xl font-semibold shadow-lg">
        Browse Listings
      </Link>
    </div>
  );
};

export default HeroPage;
