import { Request, Response } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Create premade categories
    await prisma.category.createMany({
      data: [
        {
          name: "Food",
          type: "Expense",
          userId: Number(user.id),
        },
        {
          name: "Groceries",
          type: "Expense",
          userId: Number(user.id),
        },
        {
          name: "Investing",
          type: "Expense",
          userId: Number(user.id),
        },
        {
          name: "Health",
          type: "Expense",
          userId: Number(user.id),
        },
        {
          name: "Hobbies",
          type: "Expense",
          userId: Number(user.id),
        },
        {
          name: "Shopping",
          type: "Expense",
          userId: Number(user.id),
        },
        {
          name: "Transportation",
          type: "Expense",
          userId: Number(user.id),
        },
        {
          name: "Entertainment",
          type: "Expense",
          userId: Number(user.id),
        },
        {
          name: "Salary",
          type: "Income",
          userId: Number(user.id),
        },
        {
          name: "Bonus",
          type: "Income",
          userId: Number(user.id),
        },
        {
          name: "Investment",
          type: "Income",
          userId: Number(user.id),
        },
        {
          name: "Reimbursement",
          type: "Income",
          userId: Number(user.id),
        },
      ],
    });

    res.status(201).json({
      message: "User registered",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Register failed", error });
  }
};

// LOGIN
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "12h",
    });

    // Set cookie httpOnly
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 12, // ms * s * m * h
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Login failed", error: (err as Error).message });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logout successful" });
}
