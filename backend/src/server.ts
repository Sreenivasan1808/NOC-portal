import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import config from './config/config';
import { connectDB } from "./db";
import { seedStudents, seedFacultyAdvisors, seedDepartmentRepresentatives } from './tests/authTest';


const startServer = async () => {
  try {
    await connectDB();
    await seedStudents();
    await seedFacultyAdvisors();
    await seedDepartmentRepresentatives();

    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });
  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
};

startServer();
