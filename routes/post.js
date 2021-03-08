const express = require("express");
const router = express.Router();
const authMiddleware = require("../helpers/authMiddleware");
const Deal = require("../models/Deal");
const Discussion = require("../models/Discussion");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

// add new deal
router.post(
  "/post-deal",
  [
    body("lien", "*un lien est requis").notEmpty(),

    body("url", "*une photo est requise").notEmpty(),
    body("description", "*une description est requise").notEmpty(),
    body("prix", "*prix requis").notEmpty(),
    body("prixHabituel", "*prix habituel requis").notEmpty(),
    body("titre", "*un titre est requis").notEmpty(),
  ],
  authMiddleware,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let newDeal = new Deal({ ...req.body, owner: req.userId });
    newDeal.save().then((deal) => {
      res
        .status(201)
        .send(deal)
        .catch((err) => {
          console.log(err.message);
          res.status(500).send({ msg: "Erreur Serveur" });
        });
    });
  }
);

// add new discussion
router.post("/post-discussion", authMiddleware, (req, res) => {
  let newDiscussion = new Discussion({ ...req.body, owner: req.userId });
  newDiscussion.save().then((discussion) => {
    res
      .status(201)
      .send(discussion)
      .catch((err) => {
        console.log(err.message);
        res.status(500).send({ msg: "Erreur Serveur" });
      });
  });
});
// get user deals

// router.get("/", authMiddleware, (req, res) => {
//   Deal.find({ owner: req.userId })
//     .then((deals) => {
//       res.send(deals);
//     })
//     .catch((err) => {
//       console.log(err.message);
//       res.status(500).send({ msg: "Erreur Serveur" });
//     });
// });

// get all deals

router.get("/get-all-deals", (req, res) => {
  Deal.find()
    .sort({ _id: -1 })

    .then((deals) => {
      res.send(deals);
      console.log(deals);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Erreur Serveur" });
    });
});

module.exports = router;
