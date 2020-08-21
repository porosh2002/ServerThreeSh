const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {isEmail} = require('validator')
// Database Schema
const Register = new Schema({
    name:{
        type:String,
        required:[true,'Please enter your name'],
    },
    email:{
        type:String,
        required:[true,'Please enter an email'],
        unique:[true,'This email has already been used, instead, use another email'],
        validate:[(val)=>{isEmail},'Please enter an valid email']  
    }
    ,password:{
        type:String,
        required:[true,'Please enter an password'],
        minlength:[6,'Please enter an strong password']
    },
    address:{
        type:String,
        required:[true,'Please enter your address']
    },
    district:{
        type:String,
        required:[true,'Please enter your district name']  
    }
    });
    module.exports = Register