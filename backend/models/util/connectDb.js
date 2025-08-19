import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectMongoDb = () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("MongoDB Connected");
    });
  } catch (error) {
    console.log(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
