import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { getAll, create, createCategory, getCategories } from "../controllers/TransactionController";

const router = Router();

router.get("/", authMiddleware, getAll);
router.post("/", authMiddleware, create);
router.get("/category", authMiddleware, getCategories);
router.post("/category", authMiddleware, createCategory);

export default router;
