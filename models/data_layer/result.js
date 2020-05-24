const _ = require("lodash");
const stats = require("stats-lite");
const resultsMapper = require("../data_mappers/result");
const testMapper = require("../data_mappers/test");

const removeDuplicates = (data) => {
  return _.uniqBy(
    _.orderBy(data, ["student_id", "marks_obtained"], ["asc", "desc"]),
    "student_id"
  );
};

const mapData = (data, current_max) => {
  return data.map((r) => {
    return {
      test_id: parseInt(r.test_id),
      student_id: parseInt(r.student_id),
      marks_obtained: parseInt(r.marks_obtained),
      available_marks: parseInt(r.available_marks)
        ? parseInt(r.available_marks)
        : current_max,
    };
  });
};

const omit = (data, field) => {
  return data.map((r) => _.omit(r, field));
};

const getTestData = (old_results, new_results) => {
  // find max available marks for test
  const all_results = _.concat(old_results, new_results);
  const marks = all_results.map((result) => result.available_marks);
  const available_marks = Math.max(...marks);

  // filter out results with the same student id
  const unique = _.differenceWith(new_results, old_results, _.isEqual);
  // const results = _.uniqBy(
  //   _.orderBy(unique, ["student_id", "marks_obtained"], ["asc", "desc"]),
  //   "student_id"
  // );
  const results = removeDuplicates(unique);

  // find new results
  const insertQueries = _.differenceWith(
    results,
    old_results,
    (a, b) => a.student_id === b.student_id && a.test_id === b.test_id
  );

  // // results to update
  const updateQueries = _.difference(results, insertQueries);

  const updated = removeDuplicates(
    _.concat(old_results, results, insertQueries)
  );

  // populate test table fields
  const count = updated.length;
  const marks_obtained = updated.map((result) => result.marks_obtained);
  const mean = stats.mean(marks_obtained);
  const p25 = stats.percentile(marks_obtained, 0.25);
  const p50 = stats.median(marks_obtained);
  const p75 = stats.percentile(marks_obtained, 0.75);

  return [
    insertQueries,
    updateQueries,
    { available_marks, mean, count, p25, p50, p75 },
  ];
};

/**
 * this approach is highly dependent on the kind of dataset -
 * assuming the system sends out XML files, that are submitted
 * after each test - it would contain a lot of results for the
 * same test
 * @param {an object of results containing test_id as the key and
 * student results as the values} results
 */
const storeResults = async (results) => {
  const test_ids = Object.keys(results);

  test_ids.forEach(async (test_id) => {
    const test_results = results[test_id];
    try {
      // const test = await Test.query().findById(test_id);
      const test = await testMapper.getTestById(test_id);
      if (!test) {
        // insert test and batch insert results into db
        const new_results = mapData(test_results);
        const [insertQueries, updateQueries, testData] = getTestData(
          [],
          new_results
        );
        // remove available marks from the results array
        const results_array = omit(insertQueries, "available_marks");
        const newTest = await testMapper.createTestWithResults(
          test_id,
          testData,
          results_array
        );
      } else {
        // insert results into db
        // update test db
        let old_results = await resultsMapper.getResultByTestId(test_id);
        old_results = mapData(old_results, test.available_marks);

        const new_results = mapData(test_results, test.available_marks);

        const [insert, update, testData] = getTestData(
          old_results,
          new_results
        );

        const insertQueries = omit(insert, "available_marks");
        const updateQueries = omit(update, "available_marks");

        // update test database with new available marks
        if (testData.available_marks > test.available_marks) {
          await testMapper.patchTestById(test_id, testData);
        }

        // insert any new results
        if (!_.isEmpty(insertQueries)) {
          await resultsMapper.createResult(insertQueries);
        }

        // update old results
        if (!_.isEmpty(updateQueries)) {
          updateQueries.forEach(async (query) => {
            await resultsMapper.patchResultByIds(
              test.id,
              query.student_id,
              query.marks_obtained
            );
          });
        }
      }
    } catch (e) {
      return e;
    }
  });
};

const getAggregate = async (id) => {
  return testMapper.getTestById(id);
};

module.exports = { storeResults, getAggregate };
