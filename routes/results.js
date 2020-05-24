const express = require("express");
const router = express.Router();
const resultsController = require("../controllers/results");

router.get("/:id/aggregate", resultsController.getAggregate);

module.exports = router;
