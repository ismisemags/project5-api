const mysql = require("mysql");
const config = require("./config");

const conn = mysql.createConnection(config);
const createUsersTable = `CREATE TABLE users(id int AUTO_INCREMENT, surname VARCHAR(255), firstname VARCHAR(255), email VARCHAR(255), password VARCHAR(255), PRIMARY KEY(id))`;
const createRatingsTable = `CREATE TABLE userRatings(id int AUTO_INCREMENT, ID_user int, movie_ID int, starRating int, PRIMARY KEY(id), FOREIGN KEY(ID_user) REFERENCES users(id))`;

conn.connect((err) => {
  if (err) {
    console.log("Error connecting to DB.");
    return;
  }

  conn.query(createUsersTable, (err, rows) => {
    if (err) throw err;
  });
  conn.query(createRatingsTable, (err, rows) => {
    if (err) throw err;
  });
});
