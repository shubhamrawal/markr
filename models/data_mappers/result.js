const Result = require("../Result");

const getResultByTestId = async (id) => {
  return Result.query().where("test_id", "=", id);
};

const createResult = async (results) => {
  return Result.query().insert(results);
};

const patchResultByIds = async (test_id, student_id, marks) => {
  return Result.query()
    .where("student_id", "=", student_id, "and", "test_id", "=", test_id)
    .update({ marks_obtained: marks });
};

module.exports = { getResultByTestId, createResult, patchResultByIds };
