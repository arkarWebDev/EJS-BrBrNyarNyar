const Post = require("../models/post");

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  Post.create({ title, description, imgUrl: photo, userId: req.user })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  res.render("addPost", { title: "Post create ml" });
};

exports.renderHomePage = (req, res) => {
  Post.find()
    .select("title description")
    .populate("userId", "email")
    .sort({ title: -1 })
    .then((posts) => {
      res.render("home", {
        title: "Homepage",
        postsArr: posts,
        currentUserEmail: req.session.userInfo
          ? req.session.userInfo.email
          : "",
      });
    })
    .catch((err) => console.log(err));
};

exports.getPost = (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) =>
      res.render("details", {
        title: post.title,
        post,
        currentLoginUserId: req.session.userInfo
          ? req.session.userInfo._id
          : "",
      })
    )
    .catch((err) => console.log(err));
};

exports.getEditPost = (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.redirect("/");
      }
      res.render("editPost", { title: post.title, post });
    })
    .catch((err) => console.log(err));
};

exports.updatePost = (req, res) => {
  const { postId, title, description, photo } = req.body;

  Post.findById(postId)
    .then((post) => {
      if (post.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      post.title = title;
      post.description = description;
      post.imgUrl = photo;
      return post.save().then(() => {
        console.log("Post Updated");
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.deletePost = (req, res) => {
  const { postId } = req.params;
  Post.deleteOne({ _id: postId, userId: req.user._id })
    .then(() => {
      console.log("Post Deleted!!");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
