const { Model } = require("objection");
const config = require("../knexfile");

const knex = require("knex")(config[process.env.NODE_ENV || "development"]);
Model.knex(knex);

module.exports = { Model, knex };
