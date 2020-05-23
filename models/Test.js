const { Model } = require("objection");

class Test extends Model {
  static get tableName() {
    return "tests";
  }

  static get relationMappings() {
    const Result = require("./Result");

    return {
      results: {
        relation: Model.HasManyRelation,
        modelClass: Result,
        join: {
          from: "tests.id",
          to: "results.test_id",
        },
      },
    };
  }
}
