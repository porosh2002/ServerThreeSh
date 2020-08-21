const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const Schema = mongoose.Schema;
const port = 3000 || process.env.port;
// Database Schema
const Register = new Schema({
name:{
    type:String,
    required:true,

},
email:{
    type:String,
    required:true,
    unique:true  
}
,password:{
    type:String,
    required:true
},
address:{
    type:String,
    required:true 
},
district:{
    type:String,
    required:true   
}
});
// Database Model
const RU = mongoose.model('user', Register);
// Route
// Get
// Post
app.post('/Register',async(req,res)=>{
  const {email,name,password,address,district} = req.body;
try{
  const Register =await new RU({email,name,password,address,district});
  res.status(201).json(Register)
  Register.save();
}
catch(err){
console.log(err);
res.status(400).send('Ops!')
}
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