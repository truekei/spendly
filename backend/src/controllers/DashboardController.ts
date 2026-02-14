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
      SELECT EXTRACT(DAY FROM date) AS day, CAST(MAX(balance) AS TEXT) AS balance
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

// GET SPENDING BY CATEGORY
export const getSpendingIncomeByCategory = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = (req as any).user.id;
    const { month, year } = req.query;

    const startDate = new Date(Number(year), Number(month), 1);
    const endDate = new Date(Number(year), Number(month) + 1, 1);

    const spendingByCategory = await prisma.$queryRaw`
      SELECT LOWER("Category".name) AS category, SUM("Transaction".amount) AS amount
      FROM "Transaction"
      INNER JOIN "Category" ON "Transaction"."categoryId" = "Category".id
      WHERE "Transaction"."userId" = ${Number(userId)}
      AND "Transaction".type = 'Expense'
      AND date >= ${startDate}
      AND date < ${endDate}
      GROUP BY category
      ORDER BY amount DESC
    `;

    const incomeByCategory = await prisma.$queryRaw`
      SELECT LOWER("Category".name) AS category, SUM("Transaction".amount) AS amount
      FROM "Transaction"
      INNER JOIN "Category" ON "Transaction"."categoryId" = "Category".id
      WHERE "Transaction"."userId" = ${Number(userId)}
      AND "Transaction".type = 'Income'
      AND date >= ${startDate}
      AND date < ${endDate}
      GROUP BY category
      ORDER BY amount DESC
    `;

    res.status(200).json({ spendingByCategory, incomeByCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve transactions" });
  }
};

// GET INCOME VS SPENDING
export const getIncomeVsSpending = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { year } = req.query;

    const startDate = new Date(Number(year), 0, 1);
    const endDate = new Date(Number(year) + 1, 0, 1);

    const result = (await prisma.$queryRaw`
      SELECT CAST(EXTRACT(MONTH FROM date) AS INTEGER) AS month, SUM(amount) as amount, type
      FROM "Transaction"
      WHERE "Transaction"."userId" = ${Number(userId)}
      AND date >= ${startDate}
      AND date < ${endDate}
      GROUP BY type, month
      ORDER BY month ASC
    `) as Array<{
      month: number;
      amount: number;
      type: string;
    }>;

    const incomeVsSpending: {
      month: string;
      income: number;
      spending: number;
    }[] = [];
    for (let i = 1; i <= 12; i++) {
      // if month data not found, dont include it
      if (!result.find((item: any) => item.month === i)) continue;
      const monthData = result.filter((item: any) => item.month === i);
      const income =
        monthData.find((item: any) => item.type === "Income")?.amount || 0;
      const spending =
        monthData.find((item: any) => item.type === "Expense")?.amount || 0;
      incomeVsSpending.push({
        month: String(i - 1),
        income: Number(income),
        spending: Number(spending),
      });
    }

    res.status(200).json({ incomeVsSpending });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve transactions" });
  }
};
