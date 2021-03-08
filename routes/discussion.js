const express = require("express");
const router = express.Router();
const authMiddleware = require("../helpers/authMiddleware");
const Deal = require("../models/Deal");
const Discussion = require("../models/Discussion");
const User = require("../models/User");

router.get("/get-all-Discussions", (req, res) => {
  Discussion.find()
    .sort({ _id: -1 })
    .then((Discussions) => {
      res.send(Discussions);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

router.get(`/:id`, (req, res) => {
  Discussion.findById(req.params.id)
    // console
    //   .log(req.params.id)
    //   console
    //     .log(req.originalUrl.slice(10))
    .then((discussion) => res.send(discussion))
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});
module.exports = router;
