import mongoose from 'mongoose';

export interface CarData {
  _id?: mongoose.Types.ObjectId; 
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  condition: 'New' | 'Used' | 'Excellent'; 
  description?: string; 
  images: string[];
  user: mongoose.Types.ObjectId;
}
