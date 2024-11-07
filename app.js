import express from "express";
import userRouter from "./routes/userRoutes.js";
import llmRouter from "./routes/llmRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import vitalsRouter from "./routes/vitalsRoutes.js";
import interactionsRouter from "./routes/interactionsRoutes.js";
import globalErrorHandler from "./controllers/errorController.js";
import AppError from "./utils/appError.js";
import * as middlewareFunctions from "./utils/middlewareFunctions.js";

const app = express();

middlewareFunctions.setRootDirectory("public", app);
middlewareFunctions.setMiddlewares(app);

// ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/interactions", interactionsRouter);
app.use("/api/v1/llm", llmRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/vitals", vitalsRouter);

// Get for Login and signup function
app.get("/", (req, res) => {
  res.sendFile(path.resolve("public/login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.resolve("public/signup.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.resolve("public/healthdashboard.html"));
});

// Handling incorrect routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
