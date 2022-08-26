const router = require("express").Router();

const data = require("../data/data-model");

router.get("/", (req, res, next) => {
  data
    .getAllComments()
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

router.patch("/:id", (req, res, next) => {
  const newComment = req.body;
  const { id } = req.params;
  data
    .updateCommentUpvote(newComment, id)
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

router.post("/", (req, res, next) => {
  const newComment = req.body;
  if (!newComment.content_comment) {
    next({
      statusCode: 200,
      errorMessage: "Content of comment is required for new Comment",
    });
  } else {
    data
      .addComment(newComment)
      .then((added) => {
        res.status(201).json(added);
      })
      .catch((error) => {
        next({
          statusCode: 500,
          errorMessage: "Error adding data to Comment",
          error,
        });
      });
  }
});

router.get("/:id", (req, res, next) => {
  const { user_id } = req.params;

  data
    .getAllCommentsByUserId(user_id)
    .then((comment) => {
      if (comment) {
        res.status(200).json(comment);
      } else {
        next({
          statusCode: 400,
          erorMessage: "Comment not found",
        });
      }
    })
    .catch((error) => {
      next({
        statusCode: 500,
        errorMessage: "Comment not found from DB",
        error,
      });
    });
});

module.exports = router;
