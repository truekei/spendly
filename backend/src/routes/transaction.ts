import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { getAll, create, createCategory, getCategories } from "../controllers/TransactionController";

const router = Router();


router.get("/", authMiddleware, getAll);
router.post("/create", authMiddleware, create);
router.get("/categories", authMiddleware, getCategories);
router.post("/create-category", authMiddleware, createCategory);

export default router;
