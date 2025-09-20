import { Request, Response } from "express";
import prisma from "../prisma/client";

// GET TRANSACTIONS
export const getAll = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Get all transactions" });
};

// CREATE CATEGORY
export const createCategory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { type, name } = req.body;

    const category = await prisma.category.create({
      data: {
        name: String(name),
        type: String(type),
        user: {
          connect: {
            id: Number(userId),
          },
        },
      },
    });

    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    res.status(500).json({ message: "Category creation failed", error });
  }
};
