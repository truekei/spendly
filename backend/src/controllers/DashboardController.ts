import { Request, Response } from "express";
import prisma from "../prisma/client";

// GET BALANCE FLOW
export const getBalanceFlow = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { month, year } = req.query;

    const balances = await prisma.transaction.findMany({
      select: {
        date: true,
        balance: true,
      },
      where: {
        userId,
        date: {
          gte: new Date(Number(year as string), Number(month as string) - 1, 1),
          lt: new Date(Number(year as string), Number(month as string), 1),
        },
      },
    });
    res.status(200).json({ balances });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve transactions" });
  }
};
