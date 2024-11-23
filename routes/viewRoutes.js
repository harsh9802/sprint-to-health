import express from "express";
import * as authController from "../controllers/authController.js";
// import { Country, State } from "country-state-city";
// import viewsController from "../controllers/viewsController";

const router = express.Router();
router.get("/", (req, res) => {
  res.render("landing");
});

// Sign up
router.get("/signup", (req, res) => {
  // const countries = Country.getAllCountries();
  // const states = State.getStatesOfCountry("US");

  res.render("signupPage", {
    title: "Sign Up",
  });
});

router.get("/login", (req, res) => {
  res.render("login", {
    title: "Log in to your account",
  });
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard", {
    title: "dashboard",
  });
});

router.get("/health-dashboard", (req, res) => {
  res.render("healthDashboard", {
    title: "Health Dashboard",
  });
});
export default router;
