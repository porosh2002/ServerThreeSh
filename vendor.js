const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Database Schema
const Vendor = new Schema({
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
    Address:{
        type:String,
        minlength:3,
    },
    Number:{
        type:Number,
    },
    access:{
        type:Boolean
    },
    number:{
        type:Number,
        required:true,
        unique:true
    }
    });
module.exports = Vendor
