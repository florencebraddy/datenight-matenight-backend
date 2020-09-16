require("dotenv").config();
const sql = require("mysql2/promise");

const pool = sql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

(async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("Connection Successful");
    conn.release();
  } catch (error) {
    console.log(error);
  }
})();

// (async function createUserTable() {
//   try {
//     const conn = await pool.getConnection();

//     conn.query("CREATE DATABASE IF NOT EXISTS datenight");
//     conn.query("USE datenight");

//     const userDB = await conn.query(
//       "CREATE TABLE IF NOT EXISTS user (username VARCHAR(255) UNIQUE NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, user_location VARCHAR(255) NOT NULL, profile_picture VARCHAR(255), PRIMARY KEY(username) )"
//     );
//     console.log(userDB);
//     conn.release();
//   } catch (error) {
//     console.log(error);
//   }
// })();

// (async function createDateNightTable() {
//   try {
//     const conn = await pool.getConnection();

//     conn.query("CREATE DATABASE IF NOT EXISTS datenight");
//     conn.query("USE datenight");

//     const datenightDB = await conn.query(
//       "CREATE TABLE IF NOT EXISTS activity (id INT UNIQUE NOT NULL AUTO_INCREMENT, name VARCHAR(255) UNIQUE NOT NULL, description VARCHAR(3000) NOT NULL, activity_location VARCHAR(255) NOT NULL, price VARCHAR(255) NOT NULL, PRIMARY KEY(id) )"
//     );
//     console.log(datenightDB);
//     conn.release();
//   } catch (error) {
//     console.log(error);
//   }
// })();

// (async function createReviewTable() {
//   try {
//     const conn = await pool.getConnection();

//     conn.query("CREATE DATABASE IF NOT EXISTS datenight");
//     conn.query("USE datenight");

//     const reviewDB = await conn.query(
//       "CREATE TABLE IF NOT EXISTS review (id INT UNIQUE NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, date VARCHAR(255) NOT NULL, comments VARCHAR(100000), rating VARCHAR(5), PRIMARY KEY(id), FOREIGN KEY (name) REFERENCES activity(name), FOREIGN KEY (username) REFERENCES user(username))"
//     );
//     console.log(reviewDB);
//     conn.release();
//   } catch (error) {
//     console.log(error);
//   }
// })();
