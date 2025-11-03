import express from 'express';
import authRoutes from "./routes/authRoutes.js"
import { errorHandler } from './middlewares/errorHandler.js';
import type { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';


const app = express();
app.use(express.json());
app.use(cookieParser());

// Global error handler (should be after routes)
app.use(errorHandler);


//sample route to test the server. Remove later
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello from server');
});


app.use("/api/auth", authRoutes);

export default app;
