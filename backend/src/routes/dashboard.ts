import { Router } from "express";
import {
  getBalanceFlow,
  getIncomeExpense,
} from "../controllers/DashboardController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/balance-flow", authMiddleware, getBalanceFlow);
router.get("/income-expense", authMiddleware, getIncomeExpense);

export default router;
