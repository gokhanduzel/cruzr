import { Link } from "react-router-dom";

const Footer = () => {
  return (
    // Fixed at the bottom, full width, z-index to be on top of other content
    <footer className="fixed inset-x-0 bottom-0 bg-white rounded-lg shadow px-4 py-2 dark:bg-gray-800 z-50">
      <div className="w-full mx-auto max-w-screen-xl md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <Link to="/" className="hover:underline">
            Cruzr™
          </Link>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <Link to="#" className="hover:underline mr-4 md:mr-6">
              About
            </Link>
          </li>
          <li>
            <Link to="#" className="hover:underline mr-4 md:mr-6">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="#" className="hover:underline mr-4 md:mr-6">
              Licensing
            </Link>
          </li>
          <li>
            <Link to="#" className="hover:underline">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
