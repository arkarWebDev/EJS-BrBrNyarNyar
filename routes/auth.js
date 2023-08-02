const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

// render register page
router.get("/register", authController.getRegisterPage);

// handle register
router.post("/register", authController.registerAccount);

// render login page
router.get("/login", authController.getLoginPage);

// handle login
router.post("/login", authController.postLoginData);

// handle logout
router.post("/logout", authController.logout);

// render rest password page
router.get("/reset-password", authController.getResetpage);

// render feedback page
router.get("/feedback", authController.getFeedbackPage);

// send reset email
router.post("/reset", authController.resetLinkSend);

// render change password page
router.get("/reset-password/:token", authController.getNewpasswordPage);

// change new password
router.post("/change-new-password", authController.changeNewpassword);

module.exports = router;
