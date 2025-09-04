import { Request, Response } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcrypt";

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({ message: "User registered", user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Register failed", error });
  }
};