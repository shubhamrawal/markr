exports.up = async (knex) => {
  const exists = await knex.schema.hasTable("tests");
  if (!exists) {
    return knex.schema.createTable("tests", (table) => {
      table.integer("id").primary();
      table.integer("available_marks").notNullable();
      table.float("mean").notNullable();
      table.integer("count").notNullable();
      table.float("p25").notNullable();
      table.float("p50").notNullable();
      table.float("p75").notNullable();
    });
  }
};

exports.down = async (knex) => {
  const exists = await knex.schema.hasTable("tests");
  if (exists) {
    return knex.schema.dropTable("tests");
  }
};
