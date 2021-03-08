const express = require("express");
const router = express.Router();
const authMiddleware = require("../helpers/authMiddleware");
const Deal = require("../models/Deal");
const Reply = require("../models/Reply");
const Discussion = require("../models/Discussion");
const DealComment = require("../models/DealComment");
const DiscussionComment = require("../models/DiscussionComment");
const User = require("../models/User");

router.get("/discussions", (req, res) => {
  Discussion.find()
    .then((Discussions) => {
      res.send(Discussions);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

router.get("/deals", (req, res) => {
  Deal.find()
    .then((Discussions) => {
      res.send(Discussions);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

router.get("/deals-comments", (req, res) => {
  DealComment.find()
    .then((Discussions) => {
      res.send(Discussions);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});
router.get("/discussions-comments", (req, res) => {
  DiscussionComment.find()
    .then((Discussions) => {
      res.send(Discussions);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});
router.get("/users", (req, res) => {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});
router.get("/replies", (req, res) => {
  Reply.find()
    .then((replies) => {
      res.send(replies);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});
module.exports = router;
