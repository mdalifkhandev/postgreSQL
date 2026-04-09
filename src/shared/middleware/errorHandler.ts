import { NextFunction, Request, Response } from "express";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ message: "Route not found." });
}

export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction): void {
  console.error(error);
  void req;
  void next;
  res.status(500).json({ message: "Internal server error." });
}
