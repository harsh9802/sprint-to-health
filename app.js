import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" }); // Load environment variables
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import path from "path";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

import userRouter from "./routes/userRoutes.js";
import llmRouter from "./routes/llmRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import vitalsRouter from "./routes/vitalsRoutes.js";
import interactionsRouter from "./routes/interactionsRoutes.js";
import globalErrorHandler from "./controllers/errorController.js";
import AppError from "./utils/appError.js";
import { fileURLToPath } from "url"; // Importing to get __dirname
import { dirname } from "path"; // Importing to get directory name

// Start the express app
const app = express();

// Serving static files
// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// All the static files will be served from the public folder. Example, the stylesheet.css, images, html, etc
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, "public"))); // Using the path module

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Set up a rate limiter: 100 requests per IP per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Apply the rate limiter to all requests
app.use(limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "1mb" })); // Middleware

// Section 195: Udating User Data - URL encoding parser
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
// Cookie parser, reading data from cookie into req.body
app.use(cookieParser()); // Section 189 - Cookies parser middleware for login

// Data sanitization against NoSQL query injection - eg: "email": {"$gt":""}
// What this middleware does is look at all of the req.body, req.params and req.queryString and
// remove all the instances of $ signs and dots.
// As the dollar sign is removed, anybody cannot use the above query {"$gt":""}.
app.use(mongoSanitize());

// Data sanitization against XSS
// This will clean any input from a malicious html code. Imagine some user tries to insert some malicious html code with some javascript code aatached to it.
// If that could then later be injected into our html file can create problems.
// Using this middleware will prevent this by converting all the html symbols
// Also, mongoose validation is already a very good protection against XSS,
// because it wont allow any crazy stuff to go into our database as long as we use it correctly
app.use(xss());

// // Prevent parameter pollution - In case some attacker uses multiple parameters
app.use(
  hpp({
    whitelist: [], // We whitelist or exclude the parameters for which we want to allow duplicate values
  })
);

// Use compression middleware for faster page loads
app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  // console.log(req.cookies); // Section 189
  //   console.log('Hello from the second middleware');
  next();
});

// ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/interactions", interactionsRouter);
app.use("/api/v1/llm", llmRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/vitals", vitalsRouter);

// Get for Login and signup function
app.get("/", (req, res) => {
  res.sendFile(path.resolve("public/logi  n.html"));
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
