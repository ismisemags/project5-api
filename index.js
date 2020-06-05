const express = require("express");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const util = require("util");
const mysql = require("mysql");
const sass = require('node-sass');

const config = require("./db/config");
const { getSessionUser } = require("./routes/auth");
const routesManager = require("./routes");
const port = process.env.port || 3000;

const db = mysql.createConnection(config);

db.connect(async function (err) {
  if (err) {
    throw "App could not connect to the DB. Stopping...";
  }

  const app = express();

  // Set up view engine
  const hbs = exphbs.create({
    extname: ".hbs",
  });
  app.engine("hbs", hbs.engine);
  app.set("view engine", "hbs");

  // Register middlewares
  app.use(bodyParser.urlencoded({ extended: true })); // parse POST data
  app.use(cookieParser("secret"));
  app.use(getSessionUser);
  app.use(express.static(__dirname + '/public'));

  // Register routes
  routesManager(app);

  app.listen(port,()=>{
    console.log(`Server Started on port ${port}...`);
  });
});

module.exports.db = db;