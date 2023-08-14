const fs = require("fs");

const fileDelete = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) throw err;
    console.log("file was deleted");
  });
};

module.exports = fileDelete;
