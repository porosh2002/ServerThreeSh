const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const Register = require("./Register");
const port = 3000 || process.env.port;
const RU = mongoose.model("user", Register);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Database Model
// Route
// Get
// Post
app.post("/Register", async(req, res) => {
  const { email, name, password, address, district } = req.body;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      res.redirect('/Register')
    } else {
      const Register = new RU({
        email,
        name,
        password: hash,
        address,
        district,
      });
      Register.save((err) => {
        if (err) {
          res.redirect('/Register')
        } else {res.status(201).json(Register);}});}});});
// Listening
app.listen(port, async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/myapp", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log(`Database Connected & App running in port ${port}`);
  } catch {
    console.log(`Database is't Connected & App is't running `);
  }
});
