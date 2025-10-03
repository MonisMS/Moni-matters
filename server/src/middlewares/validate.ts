import type { Request, Response, NextFunction } from "express";
import type {  ZodTypeAny } from "zod";
import { fail } from "../utils/reponse.js";

export function validate<T>(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error.flatten(); // friendly structure for FE
      return res.status(400).json(fail("Invalid request body", issues));
    }
    // Replace body with parsed/coerced data (safe, typed)
    req.body = result.data as any;
    next();
  };
}