export interface CarData {
  _id?: string; // Assuming _id is optional for some cases, like creating new cars before they're saved to the database
  make: string; // Now directly a string, after transformation in the fetching logic
  carModel: string; // Assuming you have renamed 'model' to 'carModel' to match backend changes
  year: number;
  mileage: number;
  price: number;
  description?: string; // Optional description
  images: string[]; // An array of image URLs
  user: string; // The ID of the user who posted the car listing

}