import { Request, Response } from "express";
import { getAnalytics } from "../services/analytics.service";

export async function analytics(req: Request, res: Response) {
  const data = await getAnalytics(req.user!.id);

  res.json({
    success: true,
    data
  });
}