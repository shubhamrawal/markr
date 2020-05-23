const { Model } = require("objection");
const knex = require("../knexfile");

Model.knex(knex);

module.exports = Model;
