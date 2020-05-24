const express = require("express");
const routes = require("./routes/index");
const { Model } = require("./models/index");
const xmlparser = require("express-xml-bodyparser");
xmlparser.regexp = /^text\/xml\+markr$/;

// initialise the app and listen on env port
// default to 8080
const app = express();
const port = process.env.PORT || 8080;

// middleware
app.use(express.json());
app.use(xmlparser());
// setup routes
app.use("/", routes);

// start the application
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
