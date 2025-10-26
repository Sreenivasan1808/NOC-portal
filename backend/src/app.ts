import express from 'express';
const app = express();
import authRoutes from './routes/authRoutes.js';
app.use('/api/auth', authRoutes);
import { errorHandler } from './middlewares/errorHandler.js';
import type { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import passwordRoutes from './routes/passwordRoutes.js';
app.use('/auth', passwordRoutes);



app.use(express.json());
app.use(cookieParser());

// Auth, Logout, and Protected routes
import authRouter from './routes/auth.js';
import logoutRouter from './routes/logout.js';
import protectedRouter from './routes/protected.js';
app.use('/api/auth', authRouter);
app.use('/api/auth', logoutRouter);
app.use('/api', protectedRouter);

// Routes

//sample route to test the server. Remove later
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello from server');
});

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
