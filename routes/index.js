const express = require("express");
const importRouter = require("./import");

// initialise main router
const router = express.Router();

router.use("/import", importRouter);
router.get("/", (req, res) => {
  res.status(200).send("Markr - a marking as a service platform");
});

module.exports = router;
