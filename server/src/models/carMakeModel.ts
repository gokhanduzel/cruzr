// CarMakeModel.ts
import mongoose, { Document, Schema } from 'mongoose';

interface ICarMakeModel extends Document {
  make: string;
  models: string[];
}

const carMakeModelSchema: Schema = new Schema({
  make: { type: String, required: true, unique: true },
  models: [{ type: String, required: true }]
});

const CarMakeModel = mongoose.model<ICarMakeModel>('CarMakeModel', carMakeModelSchema);

export default CarMakeModel;
