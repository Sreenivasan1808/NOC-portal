// db.ts
import mongoose from './mongooseClient';
import config from "./config/config";

mongoose.set("strictQuery", false);

export const connectDB = async () => {
  try {
    console.log("Loaded MONGO_URL =", JSON.stringify(process.env.MONGO_URL));
console.log("Config mongo_url =", config.mongo_url);
    
    await mongoose.connect(config.mongo_url);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

export default mongoose.connection;
