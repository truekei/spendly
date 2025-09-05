import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import prisma from "../prisma/client";

const router = Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true }
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User data", user });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
