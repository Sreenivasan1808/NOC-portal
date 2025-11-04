import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET ?? 'your_jwt_secret';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }
    try {
        const decoded = jwt.verify(token as string, JWT_SECRET);
        (req as any).user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
}
export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      id: string;
      email: string;
      role: string;
    };

    req.user = decoded; // ✅ typed correctly now
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};