import type { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";
import { getUserById, loginUser, registerUser } from "../services/auth.service";

export async function register(req: Request, res: Response): Promise<void> {
  const result = await registerUser(req.body);

  sendSuccess(res, 201, result, "User registered successfully");
}

export async function login(req: Request, res: Response): Promise<void> {
  const result = await loginUser(req.body);

  sendSuccess(res, 200, result, "Logged in successfully");
}

export async function getMe(req: Request, res: Response): Promise<void> {
  const user = await getUserById(req.user!.id);

  sendSuccess(res, 200, { user });
}
