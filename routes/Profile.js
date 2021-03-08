const express = require("express");
const router = express.Router();
const multer = require("multer");
const Picture = require("../models/Picture");
const authMiddleware = require("../helpers/authMiddleware");
const User = require("../models/User");
const Deal = require("../models/Deal");
const Discussion = require("../models/Discussion");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const cloudinary = require("../helpers/cloudinary");
const upload = require("../helpers/multer");

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// var upload = multer({ storage: storage });

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

router.put("/", authMiddleware, (req, res) => {
  User.findByIdAndUpdate(req.userId, { $set: req.body }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

router.post(
  "/",
  [[upload.single("avatar")], authMiddleware],
  async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // Save user
      User.findById(req.userId).then((user) => {
        user.avatar = result.secure_url;
        user
          .save()
          .then(() => res.status(200).send("Profil photo is updated!"))
          .catch((err) => {
            console.log(err.message);
            res.status(500).send({ msg: "Server Error" });
          });
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.post("/", [[upload.single("avatar")], authMiddleware], (req, res) => {
  const result = cloudinary.uploader.upload(req.file.path);

  // let path =
  //   req.protocol +
  //   "://" +
  //   req.hostname +
  //   ":" +
  //   5000 +
  //   "/uploads/" +
  //   req.file.filename;

  User.findById(req.userId).then((user) => {
    user.avatar = result.secure_url;
    user
      .save()
      .then(() => res.status(200).send("Profil photo is updated!"))
      .catch((err) => {
        console.log(err.message);
        res.status(500).send({ msg: "Server Error" });
      });
  });
});

// router.put("/editer-profile", authMiddleware, (req, res) => {
//   User.findById(req.userId).then((user) => {
//     user.pseudo = req.body.pseudo;
//     user
//       .save()
//       .then(() => res.status(200).send("Pseudo is updated!"))
//       .catch((err) => {
//         console.log(err.message);
//         res.status(500).send({ msg: "Server Error" });
//       });
//   });
// });
router.put("/editer-profile", authMiddleware, (req, res) => {
  User.findByIdAndUpdate(req.userId, { $set: req.body }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

// Update password
router.post(
  "/editer-profile/password",
  [
    body(
      "newPassword",
      "Le mot de passe doit contenir au moins 6 caractères"
    ).isLength({ min: 6 }),
    authMiddleware,
  ],
  (req, res) => {
    User.findById(req.userId).then((user) => {
      //comparaison des mots de passe
      bcrypt.compare(req.body.actualPassword, user.password, (err, isMatch) => {
        if (err) {
          throw err;
        } else if (!isMatch) {
          return res
            .status(401)
            .send({ errors: [{ msg: "Mot de passe incorrect" }] });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          console.log(errors);
          return res.status(400).json({ errors: errors.array() });
        } else if (req.body.newPassword !== req.body.confirmPassword) {
          return res.status(401).send({
            errors: [{ msg: "Les 2 mots de passe ne sont pas conformes" }],
          });
        }
        //crypter le nouveau mot de passe
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            throw err;
          }
          bcrypt.hash(req.body.newPassword, salt, (err, hashedPassword) => {
            if (err) {
              throw err;
            }
            user.password = hashedPassword;
            user
              .save()
              .then(() =>
                res.status(200).json("Votre mot de passe est changé!")
              )
              .catch((err) => {
                console.log(err.message);
                res.status(500).send({ msg: "Server Error" });
              });
          });
        });
      });
    });
  }
);

router.delete("/editer-profile", authMiddleware, (req, res) => {
  User.findByIdAndDelete(req.userId)
    .then(() => res.send({ msg: "Votre Profil est supprimé" }))
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

// get user deals

router.get("/editer-profile/deals", authMiddleware, (req, res) => {
  Deal.find({ owner: req.userId })
    .then((deals) => {
      res.send(deals);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

// get user discussions

router.get("/editer-profile/discussions", authMiddleware, (req, res) => {
  Discussion.find({ owner: req.userId })
    .then((deal) => {
      res.send(deal);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

// delete user deal

router.delete(`/mes-deals/:id`, authMiddleware, (req, res) => {
  Deal.findByIdAndDelete(req.params.id)

    .then(() => res.send({ msg: "Votre deal est supprimé" }))
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

// delete user discussion
router.delete(`/mes-discussions/:id`, authMiddleware, (req, res) => {
  Discussion.findByIdAndDelete(req.params.id)

    .then(() => res.send({ msg: "Votre discussion a été  supprimée" }))
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

// delete all user deals
router.delete("/editer-profile/deals", authMiddleware, (req, res) => {
  Deal.deleteMany({ owner: req.userId })
    .then(() => res.send({ msg: "Vos deals sont supprimée" }))
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

// delete all user discussions

router.delete("/editer-profile/discussions", authMiddleware, (req, res) => {
  Discussion.deleteMany({ owner: req.userId })
    .then(() => res.send({ msg: "Vos discussions sont supprimée" }))
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

module.exports = router;
