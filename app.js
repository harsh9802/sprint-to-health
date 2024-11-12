import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" }); // Load environment variables

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Importing routes and middlewares
import {
  userRouter,
  llmRouter,
  dashboardRouter,
  vitalsRouter,
  interactionsRouter,
} from "./routes/index.js";
import globalErrorHandler from "./controllers/errorController.js";
import AppError from "./utils/appError.js";
import {
  compressionMiddleware,
  loggingMiddleware,
  rateLimitMiddleware,
  securityMiddleware,
  parserMiddlewares,
} from "./utils/middlewares/index.js";

// Start the express app
const app = express();

// Static file serving
const __filename = fileURLToPath(import.meta.url);
const __rootDir = dirname(__filename);
app.use(express.static(path.join(__rootDir, "public")));

// Set up middlewares
parserMiddlewares(app);
securityMiddleware(app);
loggingMiddleware(app);
compressionMiddleware(app);

// Rate limiting
app.use(rateLimitMiddleware);

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/interactions", interactionsRouter);
app.use("/api/v1/llm", llmRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/vitals", vitalsRouter);

// Serve HTML files
app.get("/", (req, res) => res.sendFile(path.resolve("public/login.html")));
app.get("/signup", (req, res) =>
  res.sendFile(path.resolve("public/signup.html"))
);
app.get("/home", (req, res) =>
  res.sendFile(path.resolve("public/healthdashboard.html"))
);

// Handle incorrect routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;