const resultModel = require("../models/data_layer/result");

const getAggregate = async (req, res) => {
  const test_id = req.params.id;
  const aggregate = await resultModel.getAggregate(test_id);
  if (aggregate) {
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(aggregate));
  } else {
    res.status(404).send("404: Test ID not found");
  }
};

module.exports = { getAggregate };
