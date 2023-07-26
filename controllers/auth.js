exports.getLoginPage = (req, res) => {
  res.render("auth/login", { title: "Login" });
};

exports.postLoginData = (req, res) => {
  res.setHeader("Set-Cookie", "isLogIn=true");
  res.redirect("/");
};
