const Test = require("../Test");

const getTestById = async (id) => {
  return Test.query().findById(id);
};

const createTestWithResults = async (id, data, results) => {
  return Test.query().insertGraph({
    id: id,
    ...data,
    results: results,
  });
};

const patchTestById = async (id, data) => {
  return Test.query().patchAndFetchById(id, {
    ...data,
  });
};

module.exports = { getTestById, createTestWithResults, patchTestById };
