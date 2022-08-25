exports.up = function (knex) {
  return knex.schema.alterTable("Replies", (table) => {
    table.integer("user_id").unsigned();
    table
      .foreign("user_id")
      .references("Users.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {};
