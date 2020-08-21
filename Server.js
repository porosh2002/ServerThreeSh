const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const Register = require('./Register')
const port = 3000 || process.env.port;
// Database Model
const RU = mongoose.model('user', Register);
// Route
// Get
// Post
app.post('/Register',async(req,res)=>{
  const {email,name,password,address,district} = req.body;
  const Register =await new RU({email,name,password,address,district});
  Register.save((err)=>{
    if(err){
      console.log(err);
res.status(400).send('Ops!')
    }
    else{
      res.status(201).json(Register)
    }
  });
})
// Listening
app.listen(port,async() => {
  try{
    await mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true,useCreateIndex:true,useUnifiedTopology: true})
    console.log(`Database Connected & App running in port ${port}`);
  }
  catch{
    console.log(`Database is't Connected & App is't running `);
  }
})