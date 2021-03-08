const express = require("express");
const router = express.Router();
const authMiddleware = require("../helpers/authMiddleware");
const Deal = require("../models/Deal");
const Discussion = require("../models/Discussion");
const User = require("../models/User");
// get deal

router.get(`/:id`, (req, res) => {
  Deal.findById(req.params.id)
    // console
    //   .log(req.params.id)
    //   console
    //     .log(req.originalUrl.slice(10))
    .then((deal) => res.send(deal))
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

module.exports = router;
