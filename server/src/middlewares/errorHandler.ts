
import type { NextFunction, Request, Response } from "express";
import { fail } from "../utils/reponse.js";
export function errorHandler(err:any,req: Request, res: Response, next: NextFunction) {
    console.error(err);
    const status = typeof err?.status  === "number" ? err.status : 500;
    const message = err?.message || "Internal Server Error";
    const issues = err?.issues || err?.errors;

    res.status(status).json(fail(message, issues));
}