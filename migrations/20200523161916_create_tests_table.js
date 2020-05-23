exports.up = function (knex) {
  return knex.schema.createTable("tests", (table) => {
    table.integer("id").primary();
    table.integer("available_marks").notNullable();
    table.float("mean").notNullable();
    table.integer("count").notNullable();
    table.float("p25").notNullable();
    table.float("p50").notNullable();
    table.float("p75").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tests");
};
