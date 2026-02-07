import { Request, Response } from "express";
import prisma from "../prisma/client";

// GET BALANCE FLOW
export const getBalanceFlow = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { month, year } = req.query;

    const startDate = new Date(Number(year), Number(month), 1);
    const endDate = new Date(Number(year), Number(month) + 1, 1);

    const balances = await prisma.$queryRaw`
      SELECT EXTRACT(DAY FROM date) AS day, SUM(balance) AS balance
      FROM "Transaction"
      WHERE "userId" = ${Number(userId)}
      AND date >= ${startDate}
      AND date < ${endDate}
      GROUP BY day
      ORDER BY day ASC
    `;

    res.status(200).json({ balances });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve transactions" });
  }
};
