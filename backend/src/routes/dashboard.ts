import { Router } from "express";
import { getBalanceFlow } from "../controllers/DashboardController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/balance-flow", authMiddleware, getBalanceFlow);

export default router;
