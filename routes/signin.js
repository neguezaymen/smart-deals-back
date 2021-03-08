const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//register user

router.post(
  "/",
  [
    body("pseudo", "*un pseudo est requis")
      .notEmpty()
      .isString()
      .withMessage("Veuillez choisir un pseudo"),
    body("email", "*une adresse email est requise")
      .notEmpty()
      .isEmail()
      .withMessage("Veuillez choisir une adresse email valide"),
    body("password", "*un mot de passe  est requis")
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage("le mot de passe doit avoir au moins 6 caractères"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.find({ email: req.body.email }).then((users) => {
      if (users.length) {
        return res
          .status(400)
          .send({ errors: [{ msg: "Utilisateur existe déja" }] });
      }
      let newUser = new User(req.body);
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          throw err;
        }
        bcrypt.hash(req.body.password, salt, (err, hashedPwd) => {
          if (err) {
            throw err;
          }
          newUser.password = hashedPwd;
          newUser.save();

          let payload = {
            userId: newUser._id,
          };
          jwt.sign(payload, process.env.SECRET_KEY, (err, token) => {
            if (err) throw err;
            res.send({ token });
          });
        });
      });
    });
  }
);

module.exports = router;
