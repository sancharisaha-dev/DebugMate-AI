import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";

type AccessTokenPayload = {
  sub: string;
  email: string;
};

function isAccessTokenPayload(payload: unknown): payload is AccessTokenPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "sub" in payload &&
    "email" in payload &&
    typeof payload.sub === "string" &&
    typeof payload.email === "string"
  );
}

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    next(new AppError("Authentication token is required", 401, "UNAUTHORIZED"));
    return;
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);

    if (!isAccessTokenPayload(payload)) {
      next(new AppError("Invalid authentication token", 401, "UNAUTHORIZED"));
      return;
    }

    req.user = {
      id: payload.sub,
      email: payload.email
    };

    next();
  } catch {
    next(new AppError("Invalid or expired authentication token", 401, "UNAUTHORIZED"));
  }
}
