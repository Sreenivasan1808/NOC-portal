import express from 'express';
const app = express();
import authRoutes from './routes/authRoutes.js';
app.use('/api/auth', authRoutes);
import { errorHandler } from './middlewares/errorHandler.js';
import type { Request, Response, NextFunction } from 'express';
import passwordRoutes from './routes/passwordRoutes.js';
app.use('/auth', passwordRoutes);



app.use(express.json());

// Routes

//sample route to test the server. Remove later
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello from server');
});

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
