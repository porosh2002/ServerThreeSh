const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Database Schema
const Register = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    }
    ,password:{
        type:String,
        required:true,
        minlength:6,
    },
    address:{
        type:String,
        required:true,
    },
    district:{
        type:String,
        required:true, 
    }
    });
    module.exports = Register