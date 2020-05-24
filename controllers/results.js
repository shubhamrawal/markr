const resultModel = require("../models/data_layer/result");

const getAggregate = async (req, res) => {
  const test_id = req.params.id;
  const aggregate = await resultModel.getAggregate(test_id);
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(aggregate));
};

module.exports = { getAggregate };
