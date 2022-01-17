import mongoose from "mongoose";

interface IUser extends mongoose.Document {
  username: string;
  email: string;
  salt: string;
  hash: string;
  isAdmin?: boolean;
}

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: false,
  },
  cart: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      quantity: { type: Number, required: true },
      subTotal: { type: Number, required: true },
    },
  ],
});

export const UserModal = mongoose.model<IUser>("user", UserSchema);
