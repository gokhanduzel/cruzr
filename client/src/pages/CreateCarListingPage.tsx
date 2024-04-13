import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../features/auth/authSlice";
import axios from "axios";
import { CarData } from "../types/car";
import { CarMakeModelData } from "../types/carMakeModel";
import { createCarListing } from "../features/cars/carServices";
import { FaTrashAlt } from "react-icons/fa";

const CreateCarListingPage = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const [carMakeModels, setCarMakeModels] = useState<CarMakeModelData[]>([]);
  const [imageInput, setImageInput] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState<Omit<CarData, "_id" | "user">>({
    make: "",
    carModel: "",
    year: 2024,
    mileage: 0,
    price: 0,
    description: "",
    images: [],
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchCarMakeModels = async () => {
      try {
        const response = await axios.get<CarMakeModelData[]>(
          "http://localhost:3000/api/makemodel/carmakemodel"
        );
        setCarMakeModels(response.data);
      } catch (error) {
        console.error("Error fetching car makes and models:", error);
      }
    };

    fetchCarMakeModels();
  }, []);

  useEffect(() => {
    // Load the Cloudinary script
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      // Cleanup the script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  const handleUploadWidget = () => {
    (window as any).cloudinary.openUploadWidget(
      {
        cloudName: "dkqsznawg",
        uploadPreset: "car_listing_images",
        sources: ["local", "url", "camera"],
        cropping: true,
      },
      (error: any, result: { event: string; info: { url: string } }) => {
        if (!error && result && result.event === "success") {
          // Update your state or form data with the image URL
          console.log("Upload Successful:", result.info.url);
          setImageInput((prev) => [...prev, result.info.url]);
          setImagePreviews((prev) => [...prev, result.info.url]);
        }
      }
    );
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setImagePreviews(imagePreviews.filter((image) => image !== imageToRemove));
    setImageInput(imageInput.filter((image) => image !== imageToRemove));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Find the selected make object based on the make name
      const selectedMake = carMakeModels.find(
        (makeModel) => makeModel.make === formData.make
      );
      const submissionData = {
        ...formData,
        // Use the found make's _id, fallback to an empty string if not found
        make: selectedMake ? selectedMake._id : "",
        images: imageInput,
      };
      console.log("Car Data Being Sent:", submissionData);
      await createCarListing(submissionData); // Use the service function for creating a car listing
      alert("Car listing created successfully!");
      navigate("/cars");
    } catch (error) {
      console.error("Error creating car listing:", error);
      alert("Failed to create car listing. Please try again.");
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center pt-24 bg-gradient-to-b from-indigo-500 ...">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="border-b-2 mb-4">
          <h2 className="text-2xl font-bold mb-5 text-indigo-200">
            Create Car Listing
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="make"
              className="block text-sm font-medium text-white"
            >
              Make:
            </label>
            <select
              id="make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Make</option>
              {carMakeModels.map(({ _id, make }) => (
                <option key={_id} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="carModel"
              className="block text-sm font-medium text-white"
            >
              Model:
            </label>
            <select
              id="carModel"
              name="carModel"
              value={formData.carModel}
              onChange={handleChange}
              disabled={!formData.make}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Model</option>
              {formData.make &&
                carMakeModels
                  .find(({ make }) => make === formData.make)
                  ?.models.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="carYear"
              className="block text-sm font-medium text-white"
            >
              Year:
            </label>
            <input
              name="year"
              type="number"
              value={String(formData.year)}
              onChange={handleChange}
              placeholder="Year"
              min={1900}
              max={2025}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="carMileage"
              className="block text-sm font-medium text-white"
            >
              Mileage (km):
            </label>
            <input
              name="mileage"
              type="number"
              value={String(formData.mileage)}
              onChange={handleChange}
              placeholder="Mileage"
              min={0}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="carPrice"
              className="block text-sm font-medium text-white"
            >
              $Price:
            </label>
            <input
              name="price"
              type="number"
              value={String(formData.price)}
              onChange={handleChange}
              placeholder="Price"
              min={0}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="carDescription"
              className="block text-sm font-medium text-white"
            >
              Description:
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={50}
              placeholder="Description"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <div className="space-y-4 flex flex-row flex-wrap items-center">
              {imagePreviews.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-md mx-4"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    onClick={() => handleRemoveImage(image)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleUploadWidget}
              className="mb-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Upload Images
            </button>
          </div>

          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCarListingPage;
