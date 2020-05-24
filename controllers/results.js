const resultModel = require("../models/data_layer/result");

const getAggregate = (req, res) => {
  const test_id = req.params.id;
  const aggregate = resultModel.getAggregate();
  res.status(200).send("results router");
};

module.exports = { getAggregate };
