const mongoose = require("mongoose");

const discussionCommentSchema = mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },

  comment_to: {
    type: mongoose.Types.ObjectId,
    ref: "discussion",
  },

  replies: [
    {
      type: mongoose.Types.ObjectId,
      ref: "reply",
    },
  ],

  text: String,

  create__at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("discussionComment", discussionCommentSchema);
