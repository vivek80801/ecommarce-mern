import mongoose from "mongoose";

interface ICart extends mongoose.Document {
  name: string;
  img: string;
  des: string;
  price: number;
  num: number;
}
const cartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  des: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  num: {
    type: Number,
    required: true,
  },
});

export const CartModal = mongoose.model<ICart>("cart", cartSchema);
