import { Router } from "express";
import {
  getBalanceFlow,
  getIncomeExpense,
  getSpendingIncomeByCategory,
} from "../controllers/DashboardController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/income-expense", authMiddleware, getIncomeExpense);
router.get("/balance-flow", authMiddleware, getBalanceFlow);
router.get(
  "/spending-income-by-category",
  authMiddleware,
  getSpendingIncomeByCategory,
);

export default router;
