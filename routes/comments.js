const express = require("express");
const router = express.Router();
const authMiddleware = require("../helpers/authMiddleware");
const Deal = require("../models/Deal");
// const Discussion = require("../models/Discussion");
const DealComment = require("../models/DealComment");
const DiscussionComment = require("../models/DiscussionComment");

// post deal comment

router.post("/deal/post-comment", authMiddleware, (req, res) => {
  let newDealComment = new DealComment({
    ...req.body,
  });

  newDealComment.save().then(() => {
    res
      .status(201)
      .send({ msg: "Votre Commentaire est ajouté" })
      .catch((err) => {
        console.log(err.message);
        res.status(500).send({ msg: "Erreur Serveur" });
      });
  });
});

// get deal comments

router.get("/deal/get-comments", (req, res) => {
  DealComment.find({ dealId: req.query.id })

    .then((comments) => res.send(comments))
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

// post discussion comment

router.post("/discussion/post-comment", authMiddleware, (req, res) => {
  let newDiscussionComment = new DiscussionComment({
    ...req.body,
  });

  newDiscussionComment.save().then(() => {
    res
      .status(201)
      .send({ msg: "Votre Commentaire est ajouté" })
      .catch((err) => {
        console.log(err.message);
        res.status(500).send({ msg: "Erreur Serveur" });
      });
  });
});

// get discussion comments

router.get("/discussion/get-comments", (req, res) => {
  DiscussionComment.find({ discussionId: req.query.id })

    .then((comments) => res.send(comments))
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

module.exports = router;
