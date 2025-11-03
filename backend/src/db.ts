// db.ts
import mongoose from './mongooseClient.js';
import config from "./config/config.js";

mongoose.set("strictQuery", false);

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongo_url);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

export default mongoose.connection;
