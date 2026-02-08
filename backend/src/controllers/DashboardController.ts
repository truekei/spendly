import { Request, Response } from "express";
import prisma from "../prisma/client";

// GET BALANCE FLOW
export const getIncomeExpense = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { month, year } = req.query;

    const startDate = new Date(Number(year), Number(month), 1);
    const endDate = new Date(Number(year), Number(month) + 1, 1);

    const result = await prisma.transaction.groupBy({
      by: ["type"],
      where: {
        userId: Number(userId),
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const resultLastMonth = await prisma.transaction.groupBy({
      by: ["type"],
      where: {
        userId: Number(userId),
        date: {
          gte: new Date(Number(year), Number(month) - 1, 1),
          lt: new Date(Number(year), Number(month), 1),
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Calculate rate of change
    const getPercentageChange = (current: number, previous: number) => {
      if (previous === 0) return 0;
      return (((current - previous) / previous) * 100).toFixed(2);
    };

    res.status(200).json({
      expense: {
        total: result.find((r) => r.type === "Expense")?._sum.amount || 0,
        percentage: getPercentageChange(
          result.find((r) => r.type === "Expense")?._sum.amount || 0,
          resultLastMonth.find((r) => r.type === "Expense")?._sum.amount || 0,
        ),
      },
      income: {
        total: result.find((r) => r.type === "Income")?._sum.amount || 0,
        percentage: getPercentageChange(
          result.find((r) => r.type === "Income")?._sum.amount || 0,
          resultLastMonth.find((r) => r.type === "Income")?._sum.amount || 0,
        ),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve transactions" });
  }
};

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
