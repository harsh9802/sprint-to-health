import express from "express";
import * as userController from "../controllers/userController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// // Homepage routes
// router.route("/").get((req, res) => {
//   res.render("home"); // Render login/register page
// });

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Middleware to protect all the routes after this line
// No need to add the protect middleware to any other routes after this line in this userRoutes
router.use(authController.protect);

// Profile management routes
// Update password
router.patch("/updateMyPassword/", authController.updatePassword);

// Get the current logged in users info
router.get(
  "/me",
  userController.getMe, // We have inserted the middleware which gets the currently logged in userId and assigns to parameter userId.
  userController.getUser
);
// Update user info - Only Name and email
router.patch("/updateMe", userController.updateMe);

// Delete the logged in user
router.delete("/deleteMe/", userController.deleteMe);

// Dashboard routes
router.get("/dashboard", (req, res) => {
  res.render("dashboard"); // Render dashboard with voice assistant
});

// Health monitoring routes
router.get("/health-status", async (req, res) => {
  // Display health status
});

router.post("/health-update", async (req, res) => {
  // Update health parameters
});

// Middleware to restrict the following methods to admins only
router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
