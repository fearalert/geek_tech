import mongoose from "mongoose";
import { seedProducts } from "./seed/seed";

export const connection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/geektech-db");
    console.log("MongoDB connected");

    await seedProducts()
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
