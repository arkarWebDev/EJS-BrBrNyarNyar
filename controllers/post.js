const Post = require("../models/post");
const { validationResult } = require("express-validator");
const formatISO9075 = require("date-fns/formatISO9075");

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("addPost", {
      title: "Post create",
      errorMsg: errors.array()[0].msg,
      oldFormData: { title, description, photo },
    });
  }

  Post.create({ title, description, imgUrl: photo, userId: req.user })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.renderCreatePage = (req, res) => {
  res.render("addPost", {
    title: "Post create",
    oldFormData: { title: "", description: "", photo: "" },
    errorMsg: "",
  });
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
    .populate("userId", "email")
    .then((post) => {
      console.log(post);
      res.render("details", {
        title: post.title,
        post,
        date: post.createdAt
          ? formatISO9075(post.createdAt, { representation: "date" })
          : undefined,
        currentLoginUserId: req.session.userInfo
          ? req.session.userInfo._id
          : "",
      });
    })
    .catch((err) => console.log(err));
};

exports.getEditPost = (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.redirect("/");
      }
      res.render("editPost", {
        postId: undefined,
        title: post.title,
        post,
        errorMsg: "",
        oldFormData: {
          title: undefined,
          description: undefined,
          photo: undefined,
        },
        isValidationFail: false,
      });
    })
    .catch((err) => console.log(err));
};

exports.updatePost = (req, res) => {
  const { postId, title, description, photo } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("editPost", {
      postId,
      title,
      errorMsg: errors.array()[0].msg,
      oldFormData: { title, description, photo },
      isValidationFail: true,
    });
  }

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
