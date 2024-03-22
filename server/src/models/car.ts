import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  mileage: { type: Number, required: true },
  price: { type: Number, required: true },
  condition: { type: String, enum: ['New', 'Used', 'Excellent'], default: 'Used' },
  description: { type: String },
  images: { type: [String] } 
});

const Car = mongoose.model('Car', carSchema); 

export default Car;
