import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import prisma from "../prisma/client";

const router = Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, name: true, email: true, balance: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const handledUser = {
      ...user,
      balance: user.balance.toString(),
    };

    res.json({ message: "User data", user: handledUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
