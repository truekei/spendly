import { Request, Response } from "express";
import prisma from "../prisma/client";

// GET TRANSACTIONS
export const getAll = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const transactions = await prisma.transaction.findMany({
    where: {
      userId: Number(userId),
    },
  });
  res.status(200).json(transactions);
};

// CREATE TRANSACTION
export const create = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { type, amount, description, category, date } = req.body;

    const transaction = await prisma.transaction.create({
      data: {
        amount: Number(amount),
        type: String(type),
        description: String(description),
        date: new Date(date),
        user: {
          connect: {
            id: Number(userId),
          },
        },
        category: {
          connect: {
            id: Number(category),
          },
        },
      },
    });

    res.status(201).json({ message: "Transaction created", transaction });
  } catch (error) {
    res.status(500).json({ message: "Transaction creation failed", error });
  }
};

// GET CATEGORIES
export const getCategories = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const categories = await prisma.category.findMany({
    where: {
      userId: Number(userId),
    },
  });
  res.status(200).json(categories);
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
