import express from "express";
import * as userController from "../controllers/userController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

// Profile management routes
router.patch("/updateMyPassword/", authController.updatePassword);

router.get("/me", userController.getMe, userController.getUser);
// Update user info - Only Name and email
router.patch("/updateMe", userController.updateMe);

// Delete the logged in user
router.delete("/deleteMe/", userController.deleteMe);

// Dashboard routes
router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

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
