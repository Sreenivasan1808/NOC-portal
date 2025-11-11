import type { Request, Response, NextFunction } from 'express';

export function isAdmin(
    req: Request & { user?: { role: string } },
    res: Response,
    next: NextFunction,
) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
}
