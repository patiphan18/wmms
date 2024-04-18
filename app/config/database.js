const mysql = require('mysql2');

// const connection = mysql.createConnection({
//     host: "db",
//     database: process.env.MYSQL_DATABASE,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD
// });

const connection = mysql.createConnection({
    host: "localhost",
    database: "wmms",
    user: "root",
});

module.exports = connection;