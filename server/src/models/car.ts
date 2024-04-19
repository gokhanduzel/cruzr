// Car.ts
import mongoose, { Schema, Document } from "mongoose";
import CarMakeModel from "./carMakeModel";

export interface ICar extends Document {
  make: string;
  carModel: string;
  year: number;
  mileage: number;
  price: number;
  description?: string;
  images: string[];
  user: Schema.Types.ObjectId;
}

const carSchema: Schema = new Schema(
  {
    make: { type: String, ref: "CarMakeModel", required: true },
    carModel: { type: String, required: true, text: true },
    year: { type: Number, required: true },
    mileage: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, text: true },
    images: [{ type: String }],
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

carSchema.index({ carModel: 'text', description: 'text' });

const Car = mongoose.model<ICar>("Car", carSchema);

export default Car;
