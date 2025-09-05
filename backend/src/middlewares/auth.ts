import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token; // ambil dari cookie

  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    (req as any).user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
