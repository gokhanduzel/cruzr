export interface CarData {
  _id?: string; 
  make: string;
  carModel: string; 
  year: number;
  mileage: number;
  price: number;
  description?: string;
  images: string[];
  user?: string;
}