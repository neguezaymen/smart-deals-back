const mongoose = require("mongoose");

const DealShema = mongoose.Schema({
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
  lien: String,
  prix: String,
  prix: String,
  description: String,
  prixHabituel: String,
  groupe: String,
  expireLe: String,
  image: String,
  url: String,
  userAvatar: String,
  userPseudo: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("deal", DealShema);
