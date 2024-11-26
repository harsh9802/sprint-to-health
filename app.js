import express from "express";
import exphbs from "express-handlebars";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

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
  appointmentRouter,
  viewRouter,
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

// Test middleware
app.use((req, res, next) => {
  next();
});
// Rate limiting
app.use(rateLimitMiddleware);

// View Engine
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: __rootDir + "/views/layouts",
    partialsDir: __rootDir + "/views/partials",
  })
);
app.set("view engine", "handlebars");

// Routes
app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/interactions", interactionsRouter);
app.use("/api/v1/llm", llmRouter);
app.use("/api/v1/voice-assistant", dashboardRouter);
app.use("/api/v1/vitals", vitalsRouter);
app.use("/api/v1/appointment", appointmentRouter);

// // Serve HTML files
// app.get("/", (req, res) =>
//   res.sendFile(path.resolve("public/html/login.html"))
// );
// app.get("/signup", (req, res) =>
//   res.sendFile(path.resolve("public/html/signup.html"))
// );
// app.get("/home", (req, res) =>
//   res.sendFile(path.resolve("public/html/healthdashboard.html"))
// );

// Handle incorrect routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
