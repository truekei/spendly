import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { createCategory, getAll } from "../controllers/TransactionController";

const router = Router();


router.get("/", getAll);
router.post("/create-category", authMiddleware, createCategory);

export default router;
