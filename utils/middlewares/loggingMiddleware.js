import morgan from "morgan";

export default (app) => {
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
};
