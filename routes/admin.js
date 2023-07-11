const express = require("express");
const path = require("path");

const router = express.Router();
const postController = require("../controllers/posts")

// /admin/create-post
router.get("/create-post", postController.renderCreatePage);

router.post("/", postController.createPost);

module.exports = router
