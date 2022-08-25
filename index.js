const express = require("express");
const usersRouter = require("./routers/usersRouter");
const commentsRouter = require("./routers/commentsRouter");
const repliesRouter = require("./routers/repliesRouter");
const logger = require("./middlewares/logger");
const errorHandling = require("./middlewares/errorHandling");
var cors = require("cors");

const server = express();
server.use(cors());
server.use(express.json());
server.use(logger);

server.use("/users", usersRouter);
server.use("/comments", commentsRouter);
server.use("/replies", repliesRouter);

server.get("/", (req, res) => {
  res.send("Hello from express");
});

server.use(errorHandling);

server.listen(5000, () => {
  console.log("http://localhost:5000 listening...");
});
