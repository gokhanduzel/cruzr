import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as registrationService from "../features/registration/registrationServices";
import {
  updateField,
  setRegistering,
  setRegistrationSuccess,
} from "../features/registration/registrationSlice";
import { useSelector } from "react-redux"; // Import useSelector
import { selectRegistrationState } from "../features/registration/registrationSlice";

const RegisterPage: React.FC = () => {
  // Fetch registration state from Redux
  const registrationState = useSelector(selectRegistrationState);
  const username = registrationState.formData.username;
  const email = registrationState.formData.email;
  const password = registrationState.formData.password;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setRegistering(true));

    try {
      const formData = {
        username: username,
        email: email,
        password: password,
      };
      await registrationService.register(formData);
      dispatch(updateField({ field: "username", value: "" }));
      dispatch(updateField({ field: "email", value: "" }));
      dispatch(updateField({ field: "password", value: "" }));
      dispatch(setRegistrationSuccess(true));
      navigate("/");
    } catch (error) {
      console.error(error);
      dispatch(setRegistering(false));
    }
  };

  const handleInputChange = (
    field: keyof typeof registrationState.formData,
    value: string
  ) => {
    dispatch(updateField({ field, value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username} // Get value from Redux
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email} // Get value from Redux
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password} // Get value from Redux
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 mt-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
