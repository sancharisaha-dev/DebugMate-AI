import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from "zod";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";

export function validate(schema: AnyZodObject) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query
      });

      req.body = parsed.body;
      req.params = parsed.params;
      req.query = parsed.query;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new AppError(
            "Invalid request data",
            400,
            "VALIDATION_ERROR",
            error.flatten().fieldErrors
          )
        );
        return;
      }

      next(error);
    }
  };
}
