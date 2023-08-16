exports.isPremium = (req, res, next) => {
  if (req.session.userInfo.isPremium === false) {
    return res.redirect("/");
  }
  next();
};
