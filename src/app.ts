import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { apiRouter } from "./modules";
import { errorHandler, notFoundHandler } from "./shared/middleware/errorHandler";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
    exposedHeaders: ["set-cookie", "authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  void req;
  res.json({ message: "Server is running." });
});

app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
