import mongoose from "mongoose";

export const mongo_uri =
  process.env.MONGO_URI ?? "mongodb://localhost:27017/ecommarce-app";

export const connectDB = async () => {
  try {
    await mongoose.connect(mongo_uri);
    console.log("database is connected");
  } catch (err) {
    console.log(err);
  }
};
