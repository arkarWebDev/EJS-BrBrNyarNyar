const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.get("/login", authController.getLoginPage);
router.post("/login", authController.postLoginData);

module.exports = router;
