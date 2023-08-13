const fs = require("fs");

const fileDelete = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) throw err;
    console.log("photo was deleted");
  });
};

module.exports = fileDelete;
