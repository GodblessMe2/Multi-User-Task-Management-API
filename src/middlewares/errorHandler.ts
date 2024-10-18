import { NextFunction, Request, Response } from "express";

// Custom error handler middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
};
