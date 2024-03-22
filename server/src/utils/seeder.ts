import mongoose from "mongoose";
import Car from "../models/car";
import 'dotenv/config';

const seedData = [
  {
    make: "Toyota",
    model: "Camry",
    year: 2018,
    mileage: 50000,
    price: 20000,
    description: "Reliable sedan...",
    images: [
      "https://res.cloudinary.com/dkqsznawg/image/upload/v1711064600/samples/ecommerce/bmw_m2_red_hd3wc5.jpg",
    ],
  },
  {
    make: "Honda",
    model: "Civic",
    year: 2020,
    mileage: 30000,
    price: 22000,
    description: "Fuel-efficient and sporty...",
    images: [
      "https://res.cloudinary.com/dkqsznawg/image/upload/v1711064600/samples/ecommerce/bmw_m2_red_hd3wc5.jpg",
    ],
  },
  {
    make: "Ford",
    model: "Mustang",
    year: 2022,
    mileage: 15000,
    price: 40000,
    description: "Classic American muscle...",
    images: [
      "https://res.cloudinary.com/dkqsznawg/image/upload/v1711064600/samples/ecommerce/bmw_m2_red_hd3wc5.jpg",
    ],
  },
  {
    make: "Nissan",
    model: "Altima",
    year: 2019,
    mileage: 45000,
    price: 18000,
    description: "Dependable and comfortable...",
    images: [
      "https://res.cloudinary.com/dkqsznawg/image/upload/v1711064600/samples/ecommerce/bmw_m2_red_hd3wc5.jpg",
    ],
  },
  {
    make: "Chevrolet",
    model: "Cruze",
    year: 2017,
    mileage: 60000,
    price: 15000,
    description: "Economical and practical...",
    images: [
      "https://res.cloudinary.com/dkqsznawg/image/upload/v1711064600/samples/ecommerce/bmw_m2_red_hd3wc5.jpg",
    ],
  },
  {
    make: "Hyundai",
    model: "Sonata",
    year: 2021,
    mileage: 25000,
    price: 23000,
    description: "Stylish and spacious...",
    images: [
      "https://res.cloudinary.com/dkqsznawg/image/upload/v1711064600/samples/ecommerce/bmw_m2_red_hd3wc5.jpg",
    ],
  },
  {
    make: "Volkswagen",
    model: "Jetta",
    year: 2020,
    mileage: 35000,
    price: 20000,
    description: "German engineering...",
    images: [
      "https://res.cloudinary.com/dkqsznawg/image/upload/v1711064600/samples/ecommerce/bmw_m2_red_hd3wc5.jpg",
    ],
  },
  {
    make: "Subaru",
    model: "Outback",
    year: 2022,
    mileage: 18000,
    price: 35000,
    description: "Rugged and reliable...",
    images: [
      "https://res.cloudinary.com/dkqsznawg/image/upload/v1711064600/samples/ecommerce/bmw_m2_red_hd3wc5.jpg",
    ],
  },
  {
    make: "Jeep",
    model: "Wrangler",
    year: 2021,
    mileage: 20000,
    price: 45000,
    description: "Ready for adventure...",
    images: [
      "https://res.cloudinary.com/dkqsznawg/image/upload/v1711064600/samples/ecommerce/bmw_m2_red_hd3wc5.jpg",
    ],
  },
  {
    make: "Audi",
    model: "A4",
    year: 2022,
    mileage: 10000,
    price: 50000,
    description: "Luxury and performance...",
    images: [
      "https://res.cloudinary.com/dkqsznawg/image/upload/v1711064600/samples/ecommerce/bmw_m2_red_hd3wc5.jpg",
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    // Check if data already exists (optional)
    const carCount = await Car.countDocuments();
    if (carCount === 0) {
      await Car.insertMany(seedData);
      console.log("Database seeded with car data!");
    } else {
      console.log("Database already contains car data. Skipping seeding.");
    }

    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
