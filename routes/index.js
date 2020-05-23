const express = require("express");

// initialise main router
const router = express.Router();
router.get("/", (req, res) => {
  res.status(200).send("Markr - a marking as a service platform");
});

module.exports = router;
