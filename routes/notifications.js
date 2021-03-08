const express = require("express");
const router = express.Router();
const Discussion = require("../models/Discussion");
const Deal = require("../models/Deal");

const authMiddleware = require("../helpers/authMiddleware");
const User = require("../models/User");

router.post("/", authMiddleware, (req, res) => {
  User.findById(req.body.id).then((user) => {
    user.notifications.push(req.body.notification);
    console.log(req.body.id);
    user
      .save()
      .then(() => res.status(200))
      .then(() => res.send(user))
      .catch((err) => {
        console.log(err.message);
        res.status(500).send({ msg: "Server Error" });
      });
  });
});

router.get("/", authMiddleware, (req, res) => {
  User.findById(req.userId)
    .then((user) => {
      res.send(user.notifications);
    })
    .then(() => res.status(200))
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

module.exports = router;
