// scripts/seed.js
import dotenv from "dotenv";
import mongoose from "./mongooseClient"; // adjust path if needed
import bcrypt from "bcrypt";
import Admin from "./models/admin"; // adjust path if needed

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

export async function seedDatabase() {
  try {
    // Connect if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
      console.log("✅ Connected to MongoDB");
    }

    const data = {
      name: "Super Admin",
      email: "superadmin@gmail.com",
      password: "SuperAdmin@123",
    };

    // Check if admin already exists
    const existing = await Admin.findOne({ email: data.email });
    if (existing) {
      console.log("ℹ️ Admin already exists, skipping insert.");
    } else {
      // Hash password using bcrypt (10 salt rounds)
      const hashedPassword = await bcrypt.hash(data.password, 10);

      await Admin.create({
        ...data,
        passwordHash: hashedPassword,
      });

      console.log("✅ Admin user seeded successfully");
    }
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } 
}


