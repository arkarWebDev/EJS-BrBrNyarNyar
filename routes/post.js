const express = require("express");
const path = require("path");

const { posts } = require("./admin");
// [
//   {
//     title,
//     description,
//   },
// ];

const router = express.Router();

router.get("/", (req, res) => {
  console.log(posts);
  // res.sendFile(path.join(__dirname, "..", "views", "homepage.html"));
  res.render("home", { title: "Hello World", postsArr: posts });
});

router.get("/post", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "postpage.html"));
});

module.exports = router;
