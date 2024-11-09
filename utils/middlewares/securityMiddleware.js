import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import cors from "cors";

export default (app) => {
  app.use(cors({ origin: "*" }));
  app.use(mongoSanitize());
  app.use(xss());
  app.use(hpp({ whitelist: [] }));
  app.use(cookieParser());
};
