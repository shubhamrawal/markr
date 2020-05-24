exports.up = async (knex) => {
  const exists = await knex.schema.hasTable("results");
  if (!exists) {
    return knex.schema.createTable("results", (table) => {
      table.integer("student_id");
      table
        .integer("test_id")
        .references("id")
        .inTable("tests")
        .onDelete("CASCADE")
        .index();
      table.integer("marks_obtained").notNullable();
      table.primary(["student_id", "test_id"]);
    });
  }
};

exports.down = async (knex) => {
  const exists = await knex.schema.hasTable("results");
  if (exists) {
    return knex.schema.dropTable("results");
  }
};
