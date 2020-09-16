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
    console.log("postuser");
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
    console.log("GET ONE USER");

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

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
