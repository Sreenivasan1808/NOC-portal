import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET ?? 'your_jwt_secret';


export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      id: string;
      email: string;
      role: string;
    };

    (req as any).user = decoded; // ✅ typed correctly now
    next();
  } catch (err) {
    console.log(err);
    
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};