const { Model } = require("objection");

class Result extends Model {
  static get tableName() {
    return "results";
  }

  static get relationMappings() {
    const Test = require("./Test");

    return {
      test: {
        relation: Model.BelongsToOneRelation,
        modelClass: Test,
        join: {
          from: "results.test_id",
          to: "tests.id",
        },
      },
    };
  }
}
