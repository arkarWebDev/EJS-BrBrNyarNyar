exports.get404Page = (req, res) => {
  res.status(404).render("error/404", { title: "Page not found." });
};

exports.get500Page = (err, req, res, next) => {
  res
    .status(500)
    .render("error/500", {
      title: "Something went wrong.",
      message: err.message,
    });
};
