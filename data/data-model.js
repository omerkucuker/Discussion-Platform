const db = require("./db-config");

module.exports = {
  getAllUsers,
  addUser,
  getUserById,
  getAllComments,
  getAllCommentsByUserId,
  addComment,
  getUserByUserNameAndPassword,
  getUserImageSrcById,
  updateCommentUpvote,
  updateReplyUpvote,
  getAllRepliesByCommentId,
  addReply,
  deleteReply,
  getAllDataByUserID,
  getFeed,
};

function getAllUsers() {
  return db("Users");
}

function getUserById(id) {
  return db("Users").where({ id }).first();
}

function addUser(newUser) {
  return db("Users")
    .insert(newUser, "id")
    .then(([id]) => {
      return db("Users").where({ id }).first();
    });
}

function getUserImageSrcById(id) {
  return db
    .select(["Users.imageSrc", "Users.userName"])
    .from("Users")
    .where({ id })
    .first();
}

function getUserByUserNameAndPassword(name, pass) {
  return db
    .select(["Users.id", "Users.userName", "Users.imageSrc"])
    .from("Users")
    .where({ userName: name, password: pass })
    .first();
}

function getAllComments() {
  return db
    .select(["Users.userName", "Users.imageSrc", "Comments.*"])
    .from("Comments")
    .join("Users", "Comments.user_id", "Users.id");
}

function getAllCommentsByUserId(id) {
  return db("Comments").where({ user_id: id }).first();
}

function addComment(newComment) {
  return db("Comments")
    .insert(newComment, "id")
    .then(([id]) => {
      return db("Comments").where({ id }).first();
    });
}

function updateCommentUpvote(newComment, id) {
  return db("Comments")
    .update(newComment)
    .where({ id })
    .then((updated) => {
      if (updated) {
        return db("Comments").where({ id }).first();
      }
    });
}

function updateReplyUpvote(newReply, id) {
  return db("Replies")
    .update(newReply)
    .where({ id })
    .then((updated) => {
      if (updated) {
        return db("Replies").where({ id }).first();
      }
    });
}

function getAllRepliesByCommentId(id) {
  return db
    .select(["Users.userName", "Users.imageSrc", "Replies.*"])
    .from("Replies")
    .join("Users", "Replies.user_id", "Users.id")
    .where({ comment_id: id });
}

function addReply(newReply) {
  return db("Replies")
    .insert(newReply, "id")
    .then(([id]) => {
      return db("Replies").where({ id }).first();
    });
}

function deleteReply(id) {
  return db("Replies").del().where({ id });
}

function getAllDataByUserID(id) {
  return db
    .select()
    .from("Comments")
    .join("Users", "Comments.user_id", "Users.id")
    .leftJoin("Replies", "Comments.id", "Replies.comment_id")
    .select(
      "Comments.id",
      "Comments.content_comment",
      "Comments.comment_time",
      "Comments.upvote",
      "Comments.user_id",
      "Replies.content_reply",
      "Replies.id",
      "Replies.reply_time",
      "Replies.upvote",
      "Replies.user_id"
    )
    .where({ "Users.id": id });
}

function getFeed() {
  return db
    .select([
      "Comments.id as comment_id",
      "Users.id as user_id",
      "Replies.id as reply_id",
      "Comments.content_comment",
      "Comments.comment_time",
      "Comments.upvote as upvoteComment",
      "Replies.content_reply",
      "Replies.reply_time",
      "Replies.upvote as upvoteReply",
    ])
    .from("Comments")
    .join("Users", "Comments.user_id", "Users.id")
    .leftJoin("Replies", "Comments.id", "Replies.comment_id");
  //.where({"Users.deleted " :"false" });
}
