import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../features/auth/authSlice";
import axios from "axios";
import { CarData } from "../types/car";
import { CarMakeModelData } from "../types/carMakeModel";
import { createCarListing } from "../features/cars/carServices";

const CreateCarListingPage = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const [carMakeModels, setCarMakeModels] = useState<CarMakeModelData[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [formData, setFormData] = useState<Omit<CarData, "_id" | "user">>({
    make: "",
    carModel: "",
    year: 0,
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
          setImageInput((prev) =>
            prev ? `${prev},${result.info.url}` : result.info.url
          );
        }
      }
    );
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "images") {
      setImageInput(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
        images: imageInput.split(",").map((url) => url.trim()),
      };
      console.log("Car Data Being Sent:", submissionData);
      await createCarListing(submissionData); // Use the service function for creating a car listing
      alert("Car listing created successfully!");
      navigate("/"); // Redirect to home or listings page after successful creation
    } catch (error) {
      console.error("Error creating car listing:", error);
      alert("Failed to create car listing. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-5">Create Car Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="make"
            className="block text-sm font-medium text-gray-700"
          >
            Make
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
            className="block text-sm font-medium text-gray-700"
          >
            Model
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
            className="block text-sm font-medium text-gray-700"
          >
            Year
          </label>
          <input
            name="year"
            type="number"
            value={String(formData.year)}
            onChange={handleChange}
            placeholder="Year"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="carMileage"
            className="block text-sm font-medium text-gray-700"
          >
            Mileage (km)
          </label>
          <input
            name="mileage"
            type="number"
            value={String(formData.mileage)}
            onChange={handleChange}
            placeholder="Mileage"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="carPrice"
            className="block text-sm font-medium text-gray-700"
          >
            $Price
          </label>
          <input
            name="price"
            type="number"
            value={String(formData.price)}
            onChange={handleChange}
            placeholder="Price"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="carDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="button"
          onClick={handleUploadWidget}
          className="mb-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Upload Images
        </button>

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Listing
        </button>
      </form>
    </div>
  );
};

export default CreateCarListingPage;
