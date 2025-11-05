import express from 'express';
import authRoutes from "./routes/authRoutes"
import noDueReqRoutes from "./routes/noDueReqRoutes"
import { errorHandler } from './middlewares/errorHandler';
import type { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/adminRoutes.js';


import cors from 'cors'
import userRoutes from './routes/userRoutes';

const app = express();
app.use(express.json());
app.use(cookieParser());
// Allow CORS from the frontend during development (adjust or set CLIENT_ORIGIN in production)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);


// Global error handler (should be after routes)



//sample route to test the server. Remove later
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello from server');
});


app.use("/api/auth", authRoutes);
app.use('/admin', adminRoutes);
app.use("/api/requests", noDueReqRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

export default app;
