// Car.ts
import mongoose, { Schema, Document } from 'mongoose';
import CarMakeModel from './carMakeModel'; // Ensure correct import path

interface ICar extends Document {
  make: Schema.Types.ObjectId; // Reference to CarMakeModel
  carModel: string; // Use 'carModel' to avoid naming conflicts
  year: number;
  mileage: number;
  price: number;
  description?: string;
  images: string[];
  user: Schema.Types.ObjectId; // Reference to User model
}

const carSchema: Schema = new Schema({
  make: { type: Schema.Types.ObjectId, ref: 'CarMakeModel', required: true },
  carModel: { type: String, required: true }, // Reflect updated interface property
  year: { type: Number, required: true },
  mileage: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  description: { type: String },
  images: [{ type: String }],
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
}, { timestamps: true });

// Optional: Index for better search performance
carSchema.index({ make: 1, carModel: 1, year: -1 });

const Car = mongoose.model<ICar>('Car', carSchema);

export default Car;
