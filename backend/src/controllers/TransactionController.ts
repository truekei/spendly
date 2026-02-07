import { Request, Response } from "express";
import prisma from "../prisma/client";

// GET TRANSACTIONS
export const getAll = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Set filter condition
    const where: any = {
      userId: Number(userId),
    };

    // Handle filter by year
    const year = Number(req.query.year);
    if (year) {
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year + 1, 0, 1);
      where.date = {
        gte: startOfYear,
        lt: endOfYear,
      };
    }

    // Handle search query
    const search = (req.query.search as string)?.trim() || "";
    if (search !== "") {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { category: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const transactions = await prisma.transaction.findMany({
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        date: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where,
      orderBy: { date: "desc" },
    });

    const yearList = await prisma.transaction
      .findMany({
        select: {
          date: true,
        },
        where: {
          userId: Number(userId),
        },
      })
      .then((transactions) => transactions.map((tx) => tx.date.getFullYear()));
    const uniqueYears = Array.from(new Set(yearList)).sort((a, b) => b - a);

    res.status(200).json({ transactions, uniqueYears });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve transactions" });
  }
};

// CREATE TRANSACTION
export const create = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { type, amount, description, category, date } = req.body;

    const user = await prisma.user.findUniqueOrThrow({
      select: { balance: true },
      where: { id: userId },
    });

    const updatedBalance =
      type === "Income"
        ? user.balance + BigInt(amount)
        : user.balance - BigInt(amount);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        balance: updatedBalance,
      },
    });

    await prisma.transaction.updateMany({
      where: {
        userId: Number(userId),
        date: {
          gt: new Date(date),
        },
      },
      data: {
        balance:
          type === "Income"
            ? { increment: BigInt(amount) }
            : { decrement: BigInt(amount) },
      },
    });

    const transaction = await prisma.transaction.create({
      data: {
        amount: Number(amount),
        balance: updatedBalance,
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

    res.status(201).json({
      message: "Transaction created",
      transaction: {
        ...transaction,
        balance: transaction.balance.toString(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Transaction creation failed" });
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
