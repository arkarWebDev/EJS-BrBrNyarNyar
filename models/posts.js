const db = require("../utils/database");

module.exports = class Post {
  constructor(title, description, image_url) {
    this.title = title;
    this.description = description;
    this.image_url = image_url;
  }

  setPost() {
    return db.execute(
      "INSERT INTO posts (title,description,image_url) VALUES (?,?,?)",
      [this.title, this.description, this.image_url]
    );
  }

  static getAllPost() {
    return db.execute("SELECT * FROM posts");
  }

  static getSinglePost(id) {
    return db.execute("SELECT * FROM posts WHERE posts.id = ?", [id]);
    // SELECT * FROM posts WHERE posts.id = 1
  }
};
