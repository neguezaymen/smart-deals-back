const express = require("express");
const router = express.Router();
const multer = require("multer");
const Picture = require("../models/Picture");
const authMiddleware = require("../helpers/authMiddleware");
const User = require("../models/User");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

// router.post("/", [[upload.single("avatar")]], (req, res) => {
//   let path =
//     req.protocol +
//     "://" +
//     req.hostname +
//     ":" +
//     5000 +
//     "/uploads/" +
//     req.file.filename;
//   let newPicture = new Picture({ pictureName: path });

//   newPicture
//     .save()
//     .then((img) => res.status(201).send(img))
//     .catch((err) => {
//       console.log(err.message);
//       res.status(500).send({ msg: "Server Error" });
//     });
// });

// router.put("/", authMiddleware, (req, res) => {
//   User.findByIdAndUpdate(req.userId, { $set: req.body }, { new: true })
//     .then((user) => res.send(user))
//     .catch((err) => {
//       console.log(err.message);
//       res.status(500).send({ msg: "Erreur Serveur" });
//     });
// });
router.post(
  "/post-deal",
  [[upload.single("image")], authMiddleware],
  (req, res) => {
    let path =
      req.protocol +
      "://" +
      req.hostname +
      ":" +
      5000 +
      "/uploads/" +
      req.file.filename;
    Picture.findById(req.userId).then((picture) => {
      Picture.pictureName = path;
      user
        .save()
        .then(() => res.status(200).send("Profil photo is updated!"))
        .catch((err) => {
          console.log(err.message);
          res.status(500).send({ msg: "Server Error" });
        });
    });
  }
);

module.exports = router;
