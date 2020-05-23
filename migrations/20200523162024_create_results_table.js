exports.up = function (knex) {
  return knex.schema.createTable("results", (table) => {
    table.integer("student_id").primary();
    table
      .integer("test_id")
      .primary()
      .references("id")
      .inTable("tests")
      .onDelete("CASCADE")
      .index();
    table.integer("marks_obtained").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("results");
};
