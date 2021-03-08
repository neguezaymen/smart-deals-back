const mongoose = require("mongoose");

const DiscussionSchema = mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "comment",
    },
  ],
  titre: String,

  description: String,

  groupe: String,

  image: String,
  url: String,
  userAvatar: String,
  userPseudo: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("discussion", DiscussionSchema);
