const mongoose = require("mongoose");

const ReplySchema = mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },

  reply_to: {
    type: mongoose.Types.ObjectId,
    ref: "comment",
  },

  text: String,

  create__at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("reply", ReplySchema);
