const _ = require("lodash");

const importResults = async (req, res) => {
  // method stub
  const { body } = req;
  if (!_.isEmpty(body) && !_.isEmpty(body["mcq-test-results"])) {
    console.log(body);
    res.status(200).send("valid");
  } else {
    // console.log("invalid");
    res.status(400).send("400: Invalid POST request");
  }
};

module.exports = { importResults };
