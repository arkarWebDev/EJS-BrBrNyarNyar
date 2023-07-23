const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/post", (req, res, next) => {
  console.log("i am post middleware");
  next();
});

app.use("/admin", adminRoutes);
app.use(postRoutes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then((res) => {
    // console.log(res);
    app.listen(8080);
    console.log("connected to mongodb!!!");
  })
  .catch((err) => console.log(err));
