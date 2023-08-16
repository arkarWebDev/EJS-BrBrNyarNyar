const { validationResult } = require("express-validator");
const stripe = require("stripe")(
  "sk_test_51NffpRFLeR0FfuW3H51iS0avbLnQAmEdyd5MDyq5Zh8A8GInp0jZGLSx3gpYE7478n26r7jlkM5F50fQdpM8Iwfy00d65CCfrD"
);

const Post = require("../models/post");
const User = require("../models/user");

const POST_PAR_PAGE = 6;

exports.getProfile = (req, res, next) => {
  const pageNumber = +req.query.page || 1;
  let totalPostNumber;
  Post.find({ userId: req.user._id })
    .countDocuments()
    .then((totalPostCount) => {
      totalPostNumber = totalPostCount;
      return Post.find({ userId: req.user._id })
        .populate("userId", "email username isPremium")
        .skip((pageNumber - 1) * POST_PAR_PAGE)
        .limit(POST_PAR_PAGE)
        .sort({ createdAt: -1 });
    })
    .then((posts) => {
      if (posts.length > 0) {
        return res.render("user/profile", {
          title: req.session.userInfo.email,
          postsArr: posts,
          currentPage: pageNumber,
          hasNextPage: POST_PAR_PAGE * pageNumber < totalPostNumber,
          hasPreviousPage: pageNumber > 1,
          nextPage: pageNumber + 1,
          previousPage: pageNumber - 1,
          currentUserEmail: req.session.userInfo
            ? req.session.userInfo.email
            : "",
        });
      } else {
        return res.status(500).render("error/500", {
          title: "Something went wrong.",
          message: "No post in this page query.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Something Went Wrong");
      return next(error);
    });
};

exports.getPublicProfile = (req, res, next) => {
  const { id } = req.params;
  const pageNumber = +req.query.page || 1;
  let totalPostNumber;
  Post.find({ userId: id })
    .countDocuments()
    .then((totalPostCount) => {
      totalPostNumber = totalPostCount;
      return Post.find({ userId: id })
        .populate("userId", "email isPremium username")
        .skip((pageNumber - 1) * POST_PAR_PAGE)
        .limit(POST_PAR_PAGE)
        .sort({ createdAt: -1 });
    })
    .then((posts) => {
      if (posts.length > 0) {
        console.log(POST_PAR_PAGE * pageNumber < totalPostNumber);
        return res.render("user/public-profile", {
          title: posts[0].userId.email,
          postsArr: posts,
          currentPage: pageNumber,
          hasNextPage: POST_PAR_PAGE * pageNumber < totalPostNumber,
          hasPreviousPage: pageNumber > 1,
          nextPage: pageNumber + 1,
          previousPage: pageNumber - 1,
          currentUserEmail: posts[0].userId.email,
        });
      } else {
        return res.status(500).render("error/500", {
          title: "Something went wrong.",
          message: "No post in this page query.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Something Went Wrong");
      return next(error);
    });
};

exports.renderUsernamePage = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("user/username", {
    title: "set username",
    errorMsg: message,
    oldFormData: { username: "" },
  });
};

exports.setUsername = (req, res, next) => {
  const { username } = req.body;
  const Updateusername = username.replace("@", "");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("user/username", {
      title: "Reset Password",
      errorMsg: errors.array()[0].msg,
      oldFormData: { username },
    });
  }

  User.findById(req.user._id)
    .then((user) => {
      user.username = `@${Updateusername}`;
      return user.save().then(() => {
        console.log("username Updated");
        res.redirect("/admin/profile");
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("user not found with this ID.");
      return next(error);
    });
};

exports.renderPremiumPage = (req, res, next) => {
  stripe.checkout.sessions
    .create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1NfgUUFLeR0FfuW3hvEZkEru",
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.protocol}://${req.get(
        "host"
      )}/admin/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get(
        "host"
      )}/admin/subscription-cancel`,
    })
    .then((stripe_session) => {
      res.render("user/premium", {
        title: "Buy premium",
        session_id: stripe_session.id,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Something went wrong.");
      return next(error);
    });
};

exports.getSuccessPage = (req, res) => {
  const session_id = req.query.session_id;
  if (!session_id || !session_id.includes("cs_test_")) {
    return res.redirect("/admin/profile");
  }
  User.findById(req.user._id)
    .then((user) => {
      user.isPremium = true;
      user.payment_session_key = session_id;
      return user.save();
    })
    .then((_) => {
      res.render("user/subscription-success", {
        title: "Subscription success",
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Something went wrong.");
      return next(error);
    });
};

exports.getPremiumDetails = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      return stripe.checkout.sessions.retrieve(user.payment_session_key);
    })
    .then((stripe_session) => {
      res.render("user/premium-details", {
        title: "Status",
        customer_id: stripe_session.customer,
        country: stripe_session.customer_details.address.country,
        postal_code: stripe_session.customer_details.address.postal_code,
        email: stripe_session.customer_details.email,
        name: stripe_session.customer_details.name,
        invoice_id: stripe_session.invoice,
        status: stripe_session.payment_status,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Something went wrong.");
      return next(error);
    });
};
