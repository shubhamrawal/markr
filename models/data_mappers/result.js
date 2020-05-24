const _ = require("lodash");
const stats = require("stats-lite");
const Test = require("../Test");
const Result = require("../Result");

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

const omitAvailable = (data, field) => {
  return data.map((r) => _.omit(r, field));
};

const getTestData = (all_results) => {
  // find max available marks for test
  const marks = all_results.map((result) => result.available_marks);
  const available_marks = Math.max(...marks);

  // filter out results with the same student id
  const results = _.uniqBy(
    _.orderBy(all_results, ["student_id", "marks_obtained"], ["asc", "desc"]),
    "student_id"
  );

  // populate test table fields
  const count = results.length;
  const marks_obtained = results.map((result) => result.marks_obtained);
  const mean = stats.mean(marks_obtained);
  const p25 = stats.percentile(marks_obtained, 0.25);
  const p50 = stats.median(marks_obtained);
  const p75 = stats.percentile(marks_obtained, 0.75);

  return [results, { available_marks, mean, count, p25, p50, p75 }];
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
      const test = await Test.query().findById(test_id);
      if (!test) {
        // insert test and batch insert results into db
        const mapped = mapData(test_results);
        const [filtered, testData] = getTestData(mapped);
        // remove available marks from the results array
        const results_array = omitAvailable(filtered, "available_marks");
        const newTest = await Test.query().insertGraph({
          id: test_id,
          ...testData,
          results: results_array,
        });
      } else {
        // insert results into db
        // update test db
        let old_results = await Result.query().where("test_id", "=", test_id);
        old_results = mapData(old_results, test.available_marks);
        const new_results = mapData(test_results, test.available_marks);
        const [filtered, testData] = getTestData(
          _.concat(old_results, new_results)
        );
        let updateQueries = _.differenceBy(
          filtered,
          old_results,
          "marks_obtained"
        );
        let insertQueries = _.differenceWith(
          filtered,
          old_results,
          (a, b) => a.student_id === b.student_id && a.test_id === b.test_id
        );

        insertQueries = omitAvailable(insertQueries, "available_marks");
        updateQueries = omitAvailable(updateQueries, "available_marks");

        if (
          !_.isEqual(old_results, filtered) ||
          testData.available_marks > test.available_marks
        ) {
          // update test database with new available marks
          await Test.query().patchAndFetchById(test_id, {
            ...testData,
          });

          // insert any new results
          if (!_.isEmpty(insertQueries)) {
            await Result.query().insert(insertQueries);
          }

          // update old results
          if (!_.isEmpty(updateQueries)) {
            updateQueries.forEach(async (query) => {
              const result = await Result.query()
                .where(
                  "student_id",
                  "=",
                  query.student_id,
                  "and",
                  "test_id",
                  "=",
                  test.id
                )
                .update({ marks_obtained: query.marks_obtained });
            });
          }
        }
      }
    } catch (e) {
      return e;
    }
  });
};

module.exports = { storeResults };