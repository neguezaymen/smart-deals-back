const express = require("express");
const authMiddleware = require("../helpers/authMiddleware");
const router = express.Router();
const Comment = require("../models/DiscussionComment");
const User = require("../models/User");
const Discussion = require("../models/Discussion");
const Reply = require("../models/Reply");

//Add new comment (deal id)
router.post("/:id", authMiddleware, (req, res) => {
  let newComment = new Comment({
    text: req.body.comment,
    owner: req.userId,
    comment_to: req.params.id,
  });

  newComment
    .save()
    .then(() => {
      Comment.populate(newComment, {
        path: "owner",
        select: {
          pseudo: 1,
          avatar: 1,
        },
      }).then((comment) => res.status(201).send(comment));

      Discussion.findById(req.params.id).then((discussion) => {
        discussion.comments.push(newComment._id),
          discussion
            .save()
            .then(() => res.status(200))
            .catch((err) => {
              console.log(err.message);
              res.status(500).send({ msg: "Server Error" });
            });
      });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Server Error" });
    });
});

//Update a comment (id comment)
router.put("/:id", authMiddleware, (req, res) => {
  Comment.findByIdAndUpdate({ _id: req.params.id })
    .then((comment) => {
      if (req.userId == comment.owner) {
        comment.text = req.body.comment;
        comment
          .save()
          .then(() =>
            res.status(200).json({ id: comment._id, text: comment.text })
          )
          .catch((err) => {
            console.log(err.message);
            return res.status(500).send({ msg: "Server Error" });
          });
      }
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).send({ msg: "Server Error" });
    });
});
//delete comment
router.delete("/:id", authMiddleware, (req, res) => {
  let commentToDelete;
  let discussion;
  let replysToDelete;

  Comment.findById({ _id: req.params.id })
    .then((comment) => {
      commentToDelete = comment;
      return Reply.find({ reply_to: req.params.id });
    })
    .then((replys) => {
      replysToDelete = replys;
      return Discussion.findById({ _id: commentToDelete.comment_to });
    })
    .then((discussion) => {
      let arr = discussion.comments;
      let arrUpdated = [];

      arrUpdated = arr.filter((el) => !el.equals(commentToDelete._id));
      for (let i = 0; i < replysToDelete.length; i++) {
        let newArr = arrUpdated.filter(
          (el) => !el.equals(replysToDelete[i]._id)
        );
        arrUpdated = newArr;
        Reply.findByIdAndDelete({ _id: replysToDelete[i]._id });
      }
      discussion.comments = arrUpdated;
      return discussion.save();
    })

    .then((discussion) => {
      return Comment.findByIdAndDelete({ _id: req.params.id });
    })

    .then((resultat) => {
      res.status(200).send({ id: req.params.id });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Server Error" });
    });
});

//Add a reply (id du commentaire mère)
router.post("/reply/:id", authMiddleware, (req, res) => {
  let discussionId;
  Comment.findById({ _id: req.params.id })
    .then((comment) => {
      discussionId = comment.comment_to;
      let newReply = new Reply({
        text: req.body.reply,
        owner: req.userId,
        reply_to: req.params.id,
      });
      newReply.save().then(() => {
        Reply.populate(newReply, {
          path: "owner",
          select: {
            pseudo: 1,
            avatar: 1,
          },
        }).then((reply) => res.status(201).send(reply));

        Comment.findById({ _id: req.params.id }).then((comment) => {
          comment.replies.push(newReply._id);
          comment
            .save()
            .then(() => res.status(200))
            .catch((err) => {
              console.log(err.message);
              res.status(500).send({ msg: "Server Error" });
            });
        });
        Discussion.findById(discussionId).then((discussion) => {
          discussion.comments.push(newReply.id),
            discussion
              .save()
              .then(() => res.status(200))
              .catch((err) => {
                console.log(err.message);
                res.status(500).send({ msg: "Server Error" });
              });
        });
      });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Server Error" });
    });
});

//Update a reply ( id of the reply)
router.put("/reply/:id", authMiddleware, (req, res) => {
  Reply.findByIdAndUpdate({ _id: req.params.id })
    .then((reply) => {
      if (req.userId == reply.owner) {
        reply.text = req.body.reply;
        reply
          .save()
          .then(() =>
            res.status(200).json({
              id: reply._id,
              text: reply.text,
              reply_to: reply.reply_to,
            })
          )
          .catch((err) => {
            console.log(err.message);
            return res.status(500).send({ msg: "Server Error" });
          });
      }
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).send({ msg: "Server Error" });
    });
});

//Delete a reply (id reply)
router.delete("/reply/:id", authMiddleware, (req, res) => {
  let discussionId;
  Reply.findById({ _id: req.params.id })
    .then((reply) => {
      if (req.userId == reply.owner) {
        Comment.findById({ _id: reply.reply_to })
          .then((comment) => {
            discussionId = comment.comment_to;
            let arr = comment.replies;
            comment.replies = [];
            (comment.replies = arr.filter((el) => el != reply.id)),
              comment
                .save()
                .then(() => res.status(200))
                .catch((err) => {
                  console.log(err.message);
                  res.status(500).send({ msg: "Server Error" });
                });
            return Discussion.findById(discussionId);
          })
          .then((discussion) => {
            let arr = discussion.comments;
            discussion.comments = [];
            (discussion.comments = arr.filter((el) => el != reply.id)),
              discussion
                .save()
                .then(() => res.status(200))
                .catch((err) => {
                  console.log(err.message);
                  res.status(500).send({ msg: "Server Error" });
                });
            return Reply.findByIdAndDelete({ _id: req.params.id });
          })
          .then(() => {
            res
              .status(200)
              .send({ id: req.params.id, comment: req.body.commentId });
          });
      }
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).send({ msg: "Server Error" });
    });
});

//Get a comment (id du discussion)
router.get("/:id", (req, res) => {
  Comment.find({ comment_to: req.params.id })
    .populate({
      path: "owner",
      select: { pseudo: 1, avatar: 1 },
    })
    .populate({
      path: "replies",
      select: { text: 1, create__at: 1 },
      populate: {
        path: "owner",
        select: { pseudo: 1, avatar: 1 },
      },
    })

    .then((comment) => {
      res.send(comment);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ msg: "Server Error" });
    });
});

module.exports = router;
