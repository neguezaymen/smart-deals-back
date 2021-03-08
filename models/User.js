const mongoose = require("mongoose");

const UserShema = mongoose.Schema({
  pseudo: String,
  email: String,
  password: String,
  avatar: String,
  // pictures: [String],
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "comment",
    },
  ],
  notifications: [{}],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", UserShema);
