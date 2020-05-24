const _ = require("lodash");
const resultModel = require("../models/data_layer/result");

const isValidResult = (result) => {
  return result.every((num) => {
    return !isNaN(num);
  });
};

const parseResult = (result) => {
  // if important bits are missing throw and error
  // and reject the whole document
  const summary_marks = result["summary-marks"];
  if (!_.isEmpty(summary_marks)) {
    const { "test-id": test_id, "student-number": student_id } = result;
    const { available, obtained } = summary_marks[0]["$"];

    // the formatted result to pass onto the
    // data mapper
    const newResult = {
      test_id: test_id[0],
      student_id: student_id[0],
      available_marks: available,
      marks_obtained: obtained,
    };
    // make sure all the values are valid numbers
    if (isValidResult(Object.values(newResult))) {
      return newResult;
    } else {
      throw new Error("Invalid format");
    }
    console.log({});
  } else {
    throw new Error("Summary marks not available");
  }
};

const importResults = async (req, res) => {
  try {
    const { body } = req;
    // check to see if xml has the correct header and
    // the correct top level element
    if (!_.isEmpty(body) && !_.isEmpty(body["mcq-test-results"])) {
      const results = body["mcq-test-results"]["mcq-test-result"];
      const parsedResults = {};
      // parse each result
      results.forEach((result) => {
        const parsed = parseResult(result);
        const { test_id } = parsed;
        // form an object with test id as the key
        // and results as the value for a batch insert later
        if (test_id in parsedResults) {
          parsedResults[test_id].push(parsed);
        } else {
          parsedResults[test_id] = [parsed];
        }
      });
      // store result in the database
      const e = await resultModel.storeResults(parsedResults);
      if (!e) {
        res.status(200).send("done");
      } else {
        throw new Error(e);
      }
    } else {
      throw new Error("Invalid request");
    }
  } catch (e) {
    // console.log("invalid");
    res.status(400).send(`400: Invalid POST request. ${e.message}`);
  }
};

module.exports = { importResults };
