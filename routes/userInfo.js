const express = require("express");
const router = express.Router();
const authMiddleware = require("../helpers/authMiddleware");
const Deal = require("../models/Deal");
const Discussion = require("../models/Discussion");
const User = require("../models/User");
// get deal

router.get(`/:id`, (req, res) => {
  User.findById(req.params.id)
    // console
    //   .log(req.params.id)
    //   console
    //     .log(req.originalUrl.slice(10))
    .then((user) =>
      res.send({
        pseudo: user.pseudo,
        email: user.email,
        avatar: user.avatar,
        created_at: user.created_at,
      })
    )
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

// get user deals

router.get(`/:id/deals`, (req, res) => {
  Deal.find({ owner: req.params.id })
    .then((deals) => {
      res.send(deals);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

// get user discussions

router.get(`/:id/discussions`, (req, res) => {
  Discussion.find({ owner: req.params.id })
    .then((discussions) => {
      res.send(discussions);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

module.exports = router;
