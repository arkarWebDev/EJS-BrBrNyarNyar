// const posts = [];

const Post = require("../models/posts");

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  // console.log(`Title value is ${title} & description is ${description}`);
  const post = new Post(title, description, photo);
  post
    .setPost()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
  // posts.push({
  //   id: Math.random(),
  //   title,
  //   description,
  //   photo,
  // });
};

exports.renderCreatePage = (req, res) => {
  // res.sendFile(path.join(__dirname, "..", "views", "addPost.html"));
  res.render("addPost", { title: "Post create ml" });
};

exports.getPosts = (req, res) => {
  //   console.log(posts);
  // res.sendFile(path.join(__dirname, "..", "views", "homepage.html"));
  Post.getAllPost()
    .then(([rows]) => {
      console.log(rows);
      res.render("home", { title: "Hello World", postsArr: rows });
    })
    .catch((err) => console.log(err));
};

exports.getPost = (req, res) => {
  const postId = Number(req.params.postId);
  console.log(postId);
  //   const post = posts.find((post) => post.id === postId);
  //   console.log(post);
  Post.getSinglePost(postId)
    .then(([row]) => {
      console.log(row);
      res.render("details", { title: "Post Details Page", post: row[0] });
    })
    .catch((err) => console.log(err));
};
