const mongoose = require("mongoose");

const PictureShema = mongoose.Schema({
  pictureName: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("picture", PictureShema);
