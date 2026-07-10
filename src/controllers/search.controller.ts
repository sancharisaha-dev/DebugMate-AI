import { Request, Response } from "express";
import { searchReports } from "../services/search.service";

export async function search(req: Request, res: Response) {
  const userId = req.user!.id;

  const query = String(req.query.q ?? "");

  const reports = await searchReports(userId, query);

  res.json({
    success: true,
    data: reports
  });
}