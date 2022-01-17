import mongoose from "mongoose";

interface IProduct extends mongoose.Document {
  name: string;
  price: number;
  details: string;
  img: string;
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
});

export const ProductModal = mongoose.model<IProduct>("product", productSchema);
