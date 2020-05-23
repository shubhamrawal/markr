const express = require("express");
const routes = require("./routes/index");

// initialise the app and listen on env port
// default to 8080
const app = express();
const port = process.env.PORT || 8080;

// middleware

app.use(express.json());
// setup routes
app.use("/", routes);

// start the application
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});