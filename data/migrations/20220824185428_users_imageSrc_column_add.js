exports.up = function (knex) {
  return knex.schema.alterTable("Users", (table) => {
    table.string("imageSrc");
  });
};

exports.down = function (knex) {};
