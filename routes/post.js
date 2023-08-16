const express = require("express");
const path = require("path");

const postController = require("../controllers/post");
const userController = require("../controllers/user");

const { isPremium } = require("../middleware/is-premium");

const router = express.Router();

router.get("/", postController.renderHomePage);

router.get("/post/:postId", postController.getPost);

router.get("/save/:id", isPremium, postController.savePostAsPDF);

router.get("/profile/:id", userController.getPublicProfile);

module.exports = router;
