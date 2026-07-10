import { Router } from "express";
import { prisma } from "../config/prisma";

const router = Router();

router.get("/", async (_, res) => {
  const users = await prisma.user.findMany();

  res.json(users);
});

export default router;