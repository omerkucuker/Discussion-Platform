exports.up = function (knex) {
  return knex.schema
    .createTable("Users", (table) => {
      table.increments();
      table.string("userName").notNullable();
      table.string("password").notNullable();
      table.boolean("deleted");
    })
    .createTable("Comments", (table) => {
      table.increments();
      table.string("content_comment").notNullable();
      table.datetime("comment_time");
      table.integer("upvote").unsigned();
      table.boolean("deleted");
      table.integer("user_id").unsigned();
      table
        .foreign("user_id")
        .references("Users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("Replies", (table) => {
      table.increments();
      table.string("content_reply").notNullable();
      table.datetime("reply_time");
      table.integer("upvote").unsigned();
      table.boolean("deleted");
      table.integer("comment_id").unsigned();
      table
        .foreign("comment_id")
        .references("Comments.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("Replies")
    .dropTableIfExists("Comments")
    .dropTableIfExists("Users");
};
