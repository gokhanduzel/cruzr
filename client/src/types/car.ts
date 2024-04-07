export interface CarData {
  _id?: string; 
  make: { make: string }; 
  carModel: string; 
  year: number;
  mileage: number;
  price: number;
  description?: string; // Optional description
  images: string[]; // An array of image URLs
  user?: string; // The ID of the user who posted the car listing
}