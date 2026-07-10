import type { Response } from "express";

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  data: T,
  message?: string
): void {
  res.status(statusCode).json({
    success: true,
    data,
    ...(message ? { message } : {})
  });
}
