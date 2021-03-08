const express = require("express");
const router = express.Router();
const authMiddleware = require("../helpers/authMiddleware");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// load connected user
router.get("/", authMiddleware, (req, res) => {
  User.findById(req.userId)
    .select("-password -__v")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ msg: "utilisateur non trouvé" });
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

// login user
router.post(
  "/",
  [
    body("email", "Veuillez entrez votre adresse email")
      .notEmpty()
      .isEmail()
      .withMessage("Veuillez Entrez une adresse email valide"),
    body("password", "Veuillez Entrez votre mot de passe").notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ errors: [{ msg: "Veuillez créer un compte avant" }] });
      }
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (err) {
          throw err;
        } else if (!isMatch) {
          return res
            .status(404)
            .json({ errors: [{ msg: "Mot de passe incorrect" }] });
        } else {
          let payload = {
            userId: user._id,
          };
          jwt.sign(payload, process.env.SECRET_KEY, (err, token) => {
            if (err) throw err;
            res.send({ token });
          });
        }
      });
    });
  }
);

router.put("/", authMiddleware, (req, res) => {
  User.findByIdAndUpdate(req.userId, { $set: req.body }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

module.exports = router;
