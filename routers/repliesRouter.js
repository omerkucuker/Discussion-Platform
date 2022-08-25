const router = require("express").Router();

const data = require("../data/data-model");

router.post("/", (req, res, next) => {
  const newReply = req.body;
  if (!newReply.content_reply) {
    next({
      statusCode: 200,
      errorMessage: "Content of reply is required for new Reply",
    });
  } else {
    data
      .addReply(newReply)
      .then((added) => {
        res.status(201).json(added);
      })
      .catch((error) => {
        next({
          statusCode: 500,
          errorMessage: "Error adding data to Reply",
          error,
        });
      });
  }
});

router.patch("/:id", (req, res, next) => {
  const newReply = req.body;
  const { id } = req.params;
  data
    .updateReplyUpvote(newReply, id)
    .then((comment) => {
      res.status(200).json(comment);
    })
    .catch((error) => {
      next({
        statusCode: 500,
        errorMessage: "Error retrieving data from Comments",
        error,
      });
    });
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;

  data
    .getAllRepliesByCommentId(id)
    .then((reply) => {
      if (reply) {
        res.status(200).json(reply);
      } else {
        next({
          statusCode: 400,
          erorMessage: "reply not found",
        });
      }
    })
    .catch((error) => {
      next({
        statusCode: 500,
        errorMessage: "reply not found from DB",
        error,
      });
    });
});

module.exports = router;
