const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const Register = require("./Register");
const Product = require("./Product");
const port = 5000 || process.env.port;
const RU = mongoose.model("users", Register);
const RP = mongoose.model("product",Product);
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Database Model
// Route
// Get
// Post
// Add Product
app.post('/ProductADD',(req,res)=>{
  
})
// Login
app.post('/Login',(req,res)=>{
  const{email,password}=req.body;
  RU.findOne({ email:email}, function (err, noerr){
    if(err){
      console.log(err);
    }
    if(noerr){
      bcrypt.compare(password, noerr.password, function(error, result) {
        if(result===true){
          console.log(noerr);
        }
    });
    }
  });
})
// Register
app.post("/Register",(req, res) => {
  const { email, name, password, address, district,refferal} = req.body;
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
        refferal
      });
      Register.save((err) => {
        if (err) {
          res.redirect('/Register')
        } else {res.status(201).json(Register);}});}});
});
// Listening
app.listen(port, async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/error", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log(`Database Connected & App running in port ${port}`);
  } catch {
    console.log(`Database is't Connected & App is't running `);
  }
});
