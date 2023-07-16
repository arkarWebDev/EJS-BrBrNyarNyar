const express = require("express");
const path = require("path");

const router = express.Router();
const postController = require("../controllers/posts");

// /admin/create-post
router.get("/create-post", postController.renderCreatePage);

router.post("/", postController.createPost);

// /admin/post/id
router.post("/post/:postId", postController.deletePost);

// admin/post-edit
router.post("/post-edit", postController.updatePost);

// admin/post-edit/id
router.get("/post-edit/:postId", postController.getOldPost);

module.exports = router;
