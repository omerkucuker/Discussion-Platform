exports.up = function (knex) {
  return knex.schema
    .alterTable("Comments", (table) => {
      table.integer("upvote_comment_user_id");
    })
    .alterTable("Replies", (table) => {
      table.integer("upvote_reply_user_id");
    });
};

exports.down = function (knex) {};
