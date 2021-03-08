const mongoose = require("mongoose");

const dealCommentSchema = mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },

  comment_to: {
    type: mongoose.Types.ObjectId,
    ref: "deal",
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

module.exports = mongoose.model("dealComment", dealCommentSchema);
