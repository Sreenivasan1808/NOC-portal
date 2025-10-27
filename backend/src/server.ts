import app from './app.js';
import config from './config/config.js';
import { connectDB } from "./db.js";
import { seedStudents, seedFacultyAdvisors } from './tests/authTest.js';

const startServer = async () => {
  await connectDB(); // wait until connected
  await seedStudents();
  await seedFacultyAdvisors();
  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
  });
};

startServer();
