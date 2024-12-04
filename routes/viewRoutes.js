import express from "express";
import { Country } from "country-state-city";
import * as authController from "../controllers/authController.js";
import * as viewsController from "../controllers/viewsController.js";

const router = express.Router();
router.get("/", authController.isLoggedIn, (req, res) => {
  res.render("landing");
});

// Sign up
router.get("/signup", (req, res) => {
  const countries = Country.getAllCountries();
  // const states = State.getStatesOfCountry("US");

  res.render("signupPage", {
    title: "Sign Up",
    countries: countries,
  });
});

router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
router.get("/logout", authController.isLoggedIn);

router.get(
  "/voice-assistant",
  authController.isLoggedIn,
  authController.protect,
  (req, res) => {
    res.render("voice-assistant", {
      title: "Sprint2Health Voice Assistant",
    });
  }
);

router.get(
  "/health-dashboard",
  authController.isLoggedIn,
  authController.protect,
  viewsController.getHealthDashboard
);

router.get(
  "/appointment-dashboard",
  authController.isLoggedIn,
  authController.protect,
  viewsController.getAppointmentDashboard
);
export default router;
