const router = require("express").Router();

const data = require("../data/data-model");

router.get("/", (req, res, next) => {
  data
    .getAllUsers()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      next({
        statusCode: 500,
        errorMessage: "Error retrieving data from Users",
        error,
      });
    });
});

router.get("/getall/:id", (req, res, next) => {
  const { id } = req.params;
  data
    .getAllDataByUserID(id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      next({
        statusCode: 500,
        errorMessage: "Error retrieving data from Users",
        error,
      });
    });
});

router.get("/getfeed", async (req, res, next) => {
  const responseData = [];
  const comments = await data
    .getAllComments()
    .then((data) => {
      return data;
    })
    .catch((error) => {
      next({
        statusCode: 500,
        errorMessage: "Error retrieving data from Users",
        error,
      });
    });

  await Promise.all(
    comments.map(async (comment) => {
      const replies = await data
        .getAllRepliesByCommentId(comment.id)
        .then((data) => {
          comment.replies = data;
          responseData.push(comment);
          return data;
        })
        .catch((error) => {
          next({
            statusCode: 500,
            errorMessage: "Error retrieving data from Users",
            error,
          });
        });
    })
  );

  res.status(200).json(responseData);
});

router.post("/checkLogin", (req, res, next) => {
  const user = req.body;
  data
    .getUserByUserNameAndPassword(user.userName, user.password)
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch((error) => {
      next({
        statusCode: 500,
        errorMessage: "Error retrieving data from Users",
        error,
      });
    });
});

router.post("/", (req, res, next) => {
  const newUser = req.body;

  if (!newUser.userName && !newUser.password) {
    next({
      statusCode: 200,
      errorMessage: "UserName and Password are required for new User",
    });
  } else {
    data
      .addUser(newUser)
      .then((added) => {
        res.status(201).json(added);
      })
      .catch((error) => {
        next({
          statusCode: 500,
          errorMessage: "Error adding data to Users",
          error,
        });
      });
  }
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;

  data
    .getUserImageSrcById(id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        next({
          statusCode: 400,
          erorMessage: "User not found",
        });
      }
    })
    .catch((error) => {
      next({
        statusCode: 500,
        errorMessage: "User not found from DB",
        error,
      });
    });
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;

  data
    .getUserById(id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        next({
          statusCode: 400,
          erorMessage: "User not found",
        });
      }
    })
    .catch((error) => {
      next({
        statusCode: 500,
        errorMessage: "User not found from DB",
        error,
      });
    });
});

module.exports = router;
