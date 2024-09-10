import mongoose from "mongoose";
import { config } from "dotenv";

config(); 

const url: string = process.env.MONGO_URL || "";

const dbConnect = async () => {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

export default dbConnect;
