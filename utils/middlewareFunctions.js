import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import path from "path";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

export function setMiddlewares(app) {
  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: "*",
    })
  );

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  });

  app.use(limiter);

  app.use(mongoSanitize());

  app.use(xss());

  app.use(
    hpp({
      whitelist: [],
    })
  );

  app.use(compression());

  app.use((req, res, next) => {
    req.requestTime = new Date().toString();
    next();
  });
}

export function setRootDirectory(directory, app) {
  const __rootDir = dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.join(__rootDir, directory)));
}
