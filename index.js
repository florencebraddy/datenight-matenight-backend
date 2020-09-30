require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const PORT = 4000;

const app = express();
app.use(express.json());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

//POST USER
app.post("/user", async (request, response) => {
  try {
    console.log("post user");
    console.log([
      request.body.username,
      request.body.first_name,
      request.body.last_name,
      request.body.user_location,
      request.body.profile_picture
    ]);

    if (
      !request.body.username ||
      !request.body.first_name ||
      !request.body.last_name ||
      !request.body.user_location ||
      !request.body.profile_picture
    ) {
      return response
        .status(400)
        .send({ message: "Please enter all required information" });
    }
    const con = await pool.getConnection();
    const queryResponse = await con.execute(
      "INSERT INTO datenight.user (username, first_name, last_name, user_location, profile_picture) VALUES (?, ?, ?, ?, ?)",
      [
        request.body.username,
        request.body.first_name,
        request.body.last_name,
        request.body.user_location,
        request.body.profile_picture
      ]
    );
    con.release();

    console.log(queryResponse);

    response.status(200).send({ messge: queryResponse });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

// GET SINGLE USER AT LOGIN
app.get("/user", async (request, response) => {
  try {
    console.log("Get one user");

    /*const email = request.decodedToken.email;
    if (!email) {
      response.status(400).send({ message: 'access denied' });
    }*/

    const con = await pool.getConnection();
    const recordset = await con.execute(
      "SELECT * FROM datenight.user WHERE username=?",
      [request.query.username]
    );
    con.release();

    console.log(recordset[0]);

    response.status(200).send({ message: recordset[0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ error: error.message, message: error });
  }
});

//DELETE USER
app.delete("/user", async (request, response) => {
  try {
    console.log("Delete user");

    const conn = await pool.getConnection();
    const recordSet = await conn.execute(
      `DELETE FROM datenight.user WHERE username = ?`,
      [request.query.username]
    );
    conn.release();
    console.log(recordSet);

    response.status(200).send({ message: recordSet[0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

//POST ACTIVITY

app.post("/activity", async (request, response) => {
  try {
    console.log("post activity");

    const con = await pool.getConnection();
    const queryResponse = await con.execute(
      "INSERT INTO datenight.activity ( id, name, description, activity_location, price, location, category) VALUES ( ?, ?, ?, ?, ?, ?, ?)",
      [
        request.body.id,
        request.body.name ? request.body.name : null,
        request.body.description ? request.body.description : null,
        request.body.activity_location ? request.body.activity_location : null,
        request.body.price ? request.body.price : null,
        request.body.location ? request.body.location : null,
        request.body.category ? request.body.category : null
      ]
    );
    con.release();

    console.log(queryResponse);

    response.status(200).send({ message: queryResponse });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

//GET ALL ACTIVITES

app.get("/search/activities", async (request, response) => {
  try {
    console.log("get all activities");

    const con = await pool.getConnection();
    const queryResponse = await con.execute("SELECT * FROM datenight.activity");
    con.release();

    console.log(queryResponse);

    response.status(200).send({ message: queryResponse[0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

//GET SINGLE ACTIVITY
app.get("/search/activity", async (request, response) => {
  try {
    console.log("get single activity");

    const con = await pool.getConnection();
    const queryResponse = await con.execute(
      "SELECT * FROM datenight.activity WHERE name=? OR description=? OR activity_location=? OR price=? OR location=? OR category=?",
      [
        request.query.name ? request.query.name : null,
        request.query.description ? request.query.description : null,
        request.query.activity_location
          ? request.query.activity_location
          : null,
        request.query.price ? request.query.price : null,
        request.query.location ? request.query.location : null,
        request.query.category ? request.query.category : null
      ]
    );
    con.release();

    console.log(queryResponse[0]);

    response.status(200).send({ message: queryResponse[0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

//POST REVIEW
app.post("/review", async (request, response) => {
  try {
    console.log("post review");

    const con = await pool.getConnection();
    const queryResponse = await con.execute(
      "INSERT INTO datenight.review ( id, username, name, date, comments, rating) VALUES ( ?, ?, ?, ?, ?, ?)",
      [
        request.body.id,
        request.body.username ? request.body.username : null,
        request.body.name ? request.body.name : null,
        request.body.date ? request.body.date : null,
        request.body.comments ? request.body.comments : null,
        request.body.rating ? request.body.rating : null
      ]
    );
    con.release();

    console.log(queryResponse);

    response.status(200).send({ message: queryResponse });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

//GET USER REVIEW
app.get("/user/review", async (request, response) => {
  try {
    console.log("Get one users reviews");

    const con = await pool.getConnection();
    const recordset = await con.execute(
      "SELECT * FROM datenight.review WHERE username=?",
      [request.query.username]
    );
    con.release();

    console.log(recordset[0]);

    response.status(200).send({ message: recordset[0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ error: error.message, message: error });
  }
});

//DELETE REVIEW
app.delete("/review", async (request, response) => {
  try {
    console.log("Delete review");
    console.log("request query", request.query);
    const conn = await pool.getConnection();
    const recordSet = await conn.execute(
      `DELETE FROM datenight.review WHERE username = ? AND name =?`,
      [request.query.username, request.query.name]
    );
    conn.release();
    console.log(recordSet);

    response.status(200).send({ message: recordSet[0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

//GET ALL REVIEWS FOR ACTIVITY

app.get("/activity/review", async (request, response) => {
  try {
    console.log("Get activity review");
    const conn = await pool.getConnection();
    const recordSet = await conn.execute(
      "SELECT * FROM datenight.review WHERE name = ?",
      [request.query.name]
    );
    conn.release();
    console.log(recordSet[0][0]);
    response.status(200).send({ message: recordSet[0][0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
