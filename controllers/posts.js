// const posts = [];

const Post = require("../models/posts");

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  Post.create({
    title,
    description,
    imgUrl: photo,
  })
    .then((result) => {
      console.log(result);
      console.log("New post created");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  res.render("addPost", { title: "Post create ml" });
};

exports.getPosts = (req, res) => {
  Post.findAll()
    .then((posts) => {
      res.render("home", { title: "Home Page", postsArr: posts });
    })
    .catch((err) => console.log(err));
};

exports.getPost = (req, res) => {
  const postId = req.params.postId;
  // Post.findByPk(postId)
  //   .then((post) => {
  //     res.render("details", { title: "Post Details Page", post });
  //   })
  //   .catch((err) => console.log(err));
  Post.findOne({ where: { id: postId } })
    .then((post) => {
      res.render("details", { title: "Post Details Page", post });
    })
    .catch((err) => console.log(err));
};
