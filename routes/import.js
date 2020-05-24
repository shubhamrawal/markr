const express = require("express");
const router = express.Router();
const importController = require("../controllers/import");

router.post("/", importController.importResults);

module.exports = router;
