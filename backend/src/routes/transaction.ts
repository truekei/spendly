import { Router } from "express";
import {
  create,
  createCategory,
  destroy,
  getAll,
  getCategories,
  update,
} from "../controllers/TransactionController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, getAll);
router.post("/", authMiddleware, create);
router.patch("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, destroy);
router.get("/category", authMiddleware, getCategories);
router.post("/category", authMiddleware, createCategory);

export default router;
