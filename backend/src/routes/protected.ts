import express from 'express';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import type { Request, Response } from 'express';

const router = express.Router();

// Example protected route
router.get('/protected', authenticateJWT, (req: Request, res: Response) => {
    res.json({ message: 'You have accessed a protected route!', user: (req as any).user });
});

export default router;
