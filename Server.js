const express = require("express");
require('dotenv').config()
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const path = require("path");
const saltRounds = 10;
const Register = require("./Register");
const Schema = mongoose.Schema;
const Product = require("./Product");
const helmet = require("helmet");
const vendor = require("./vendor");
const imageCollect = require("./imagecollect");
const port = 5000 || process.env.port;
const RU = mongoose.model("users", Register);
const RV = mongoose.model("Vendors", vendor);
const RP = mongoose.model("product", Product);
const IC = mongoose.model("imageCollect", imageCollect);
const multer = require("multer");
const shortid = require("shortid");

const imageCollectNID = new Schema({
  image1:{
    type:Buffer,
    required:true,
  },
  imageID:{
    type:String,
    required:true,
  },
});
const ICN = mongoose.model("imageNID", imageCollectNID);
const avatar = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|JPG|PNG|JPEG|jpeg)$/))
    return cb(new Error("This is not a correct format of the file"));
    cb(undefined, true);
  },
});
const AddBrand = new mongoose.Schema({
  Brand: {
    type: String,
    required: true,
    unique: true,
  },
});
var whitelist = ['http://3pshopping.com', 'https://3pshopping.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// Database Model
// Route
// Get
app.get("/vendorApprove",cors(corsOptions),(req,res1)=>{
  RV.find({access:false},(err,res)=>{
    if(err){
      console.log(err);
    }
    if(res){
      res1.json(res)
    }
  })
})
app.get("/geTNidiMagE/:id",cors(corsOptions), (req, res) => {
  ICN.find({}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.set("Content-Type", "image/jpeg");
      res.send(result[0].image1);
    }
  });
});
app.post('/approve/:id',cors(corsOptions),(req,res)=>{
  RV.updateOne({_id:req.params.id},{access:true},(err,ok)=>{
    if(err){
      console.log(err);
    }
    if(ok){
      console.log('updated');
    }
  })
})
app.post("/deleteProduct/:id",cors(corsOptions),(req,res1)=>{
  let imageID = null ;
  RP.findOne({_id:req.params.id},(err,res2)=>{
    if(res2){
      imageID = res2.imageID
      RP.deleteOne({_id:req.params.id},(err,success)=>{
        if(success){
          IC.deleteOne({imageID:imageID},(err,res)=>{
            if(res){
              res1.end()
            }
            if(err){
              console.log(err);
            }
          })
        }
        if(err){
          console.log(err);
        }
      })
    }
    if(err){
      console.log(err);
    }
  })
})

app.post("/ProductEdit/:id",cors(corsOptions), (req, res) => {
  const {
    iteam,
    price,
    description,
    vendor,
    tags,
    size,
    offer,
    BrandName,
    imageID,
  } = req.body;
  RP.updateOne({imageID:req.params.id},{iteam,
    price,
    description,
    vendor,
    tags,
    size,
    offer,
    BrandName,
    imageID,},(err,data)=>{
    if(err){
      console.log(err);
    }
    if(data){
      res.send(data)
    }
  })
});
app.post("/ProductEditV/:email/:id",cors(corsOptions), (req, res) => {
  const {
    iteam,
    price,
    description,
    vendor,
    tags,
    size,
    offer,
    BrandName,
  } = req.body;
  RP.findOne({_id:req.params.id},(err,response)=>{
    if(err){
      console.log(err);
    }
    if(response){
      if(req.params.email=response.vendor){
        RP.updateOne({_id:req.params.id},{    iteam,
          price,
          description,
          vendor,
          tags,
          size,
          offer,
          BrandName,
          },(err,ok)=>{
            if(err){
              console.log(err);
            }
            if(ok){
              console.log(ok);
            }
          })
      }
      
    }
  })
});
app.post("/DeleteV/:email/:id",cors(corsOptions), (req, res) => {
  RP.findOne({_id:req.params.id},(err,response)=>{
    if(err){
      console.log(err);
    }
    if(response){
      if(req.params.email=response.vendor){
        RP.deleteOne({_id:req.params.id},(err,ok)=>{
            if(err){
              console.log(err);
            }
            if(ok){
              console.log(ok);
            }
          })
      }
      
    }
  })
});

app.post("/ProductPICNID/:id",cors(corsOptions), avatar.single("upload"), (req, res) => {
  const image1 = req.file.buffer;
  const imageID = req.params.id;
  console.log(imageID);
  const imageCollectNID = new ICN({
    image1,
    imageID,
  });
  imageCollectNID.save();
  res.end();
});



app.get("/getuserdata/:id",cors(corsOptions), (req, res) => {
  RU.find({ _id: req.params.id }, function (err, result) {
    if (err) {
    } else {
      res.send(result);
    }
  });
});
app.get("/getvendordata/:id",cors(corsOptions), (req, res) => {
  RV.find({ _id: req.params.id }, function (err, result) {
    if (err) {
    } else {
      res.json(result);
    }
  });
});

app.get("/geTiMagE/:id",cors(corsOptions), (req, res) => {
  IC.find({ imageID: req.params.id }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.set("Content-Type", "image/jpeg");
      res.send(result[0].image1);
    }
  });
});
app.get("/geTiMagE2/:id",cors(corsOptions), (req, res) => {
  IC.find({ imageID: req.params.id }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.set("Content-Type", "image/jpeg");
      res.send(result[0].image1);
    }
  });
});
app.get("/geTiMagE3/:id",cors(corsOptions), (req, res) => {
  IC.find({ imageID: req.params.id }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.set("Content-Type", "image/jpeg");
      res.send(result[0].image2);
    }
  });
});
app.get("/geTiMagE4/:id",cors(corsOptions), (req, res) => {
  IC.find({ imageID: req.params.id }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.set("Content-Type", "image/jpeg");
      res.send(result[0].image3);
    }
  });
});

app.get("/AllProduct",cors(corsOptions), (req, res) => {
  RP.find({}, function (err, result) {
    if (err) {
      console.log(err, "err in fething product");
    } else {
      res.json(result);
    }
  });
});
app.get("/Product/:id",cors(corsOptions), (req, res) => {
  RP.find({ _id: req.params.id }, function (err, result) {
    if (err) {
      console.log(err, "err in fething product");
    } else {
      res.json(result);
    }
  });
});
app.get("/refferF/:id",cors(corsOptions), (req, res) => {
  RU.find({ _id: req.params.id }, function (err, result) {
    if (err) {
      console.log(err, "err in fething product");
    } else {
      res.json(result);
    }
  });
});
// Post
app.post("/delete/:id",cors(corsOptions), (req, res) => {
  RU.deleteOne({ _id: req.params.id }, function (err) {
    if (err) console.log(err);
  });
});
app.post("/update/:id",cors(corsOptions), (req, res) => {
  const { name, email } = req.body;
  console.log(name);
  RU.updateOne({ _id: req.params.id }, { name, email }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
    }
  });
});
app.post("/updateEarn/:id",cors(corsOptions), (req, res) => {
  const { earn } = req.body;
  RU.updateOne({ _id: req.params.id }, { earn }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
    }
  });
});



// Add Product
app.post("/ProductADD",cors(corsOptions), (req, res) => {
  const {
    iteam,
    price,
    description,
    vendor,
    tags,
    size,
    offer,
    BrandName,
    imageID,
  } = req.body;
  const Product = new RP({
    iteam,
    price,
    description,
    vendor,
    tags,
    size,
    offer,
    BrandName,
    imageID,
  });
  Product.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.status(201).json(Product);
    }
  });
});
app.post("/ProductPIC",cors(corsOptions), avatar.array("upload", 3), (req, res) => {
  const image1 = req.files[0].buffer;
  const image2 = req.files[1].buffer;
  const image3 = req.files[2].buffer;
  const imageID = req.body.upload;
  const imageCollect = new IC({
    image1,
    image2,
    image3,
    imageID,
  });
  imageCollect.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.status(201).json(Product);
    }
  });
});
app.post("/ref/:id/:price",cors(corsOptions), (req, res) => {
  const price7 = (req.params.price * 7) / 100;
  const price5 = (req.params.price * 5) / 100;
  RU.find({ _id: req.params.id }, function (err, data) {
    if (err) {
      console.log(err);
    }
    if (data) {
if(data[0].refferal!==000){
  RU.find({ ownrefferal: data[0].refferal }, function (err, ref1data) {
    if (ref1data) {
      const earnValue = ref1data[0].earn;
      const updateEarn = earnValue + price7;
      RU.updateOne(
        { _id: ref1data[0]._id },
        { earn: updateEarn },
        function (err, done1) {
          if (done1) {
            RU.find({ownrefferal:ref1data[0].refferal},function(err,data2nd){
               if(data2nd){
                const earnValue2 = data2nd[0].earn;
                const updateEarn2 = earnValue2 + price5;
                RU.updateOne({_id:data2nd[0]._id},{earn:updateEarn2},function(err,success){
                  if(err){
                    console.log(err);
                  }
                  if(success){
                    res.json(':)');
                  }
                })
               }
            })
          }
        }
      );
    }
  });
}
    }
  });
});
// Login
app.post("/Login",cors(corsOptions), (req, res) => {
  const { email, password } = req.body;
  RU.findOne({ email: email }, function (err, noerr) {
    if (err) {
      console.log(err);
    }
    if (noerr) {
      bcrypt.compare(password, noerr.password, function (error, result) {
        if (result === true) {
          res.json(noerr._id);
        }
        if (error) {
          console.log(error);
        }
      });
    }
  });
});
// Register
app.post("/Register",cors(corsOptions), (req, res) => {
  const { email, name, password, refferal } = req.body;
  const earn = 0;
  const ownrefferal = shortid.generate();
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      res.redirect("/Register");
    } else {
      const Register = new RU({
        email,
        name,
        password: hash,
        refferal,
        ownrefferal,
        earn,
      });
      Register.save();
    }
  });
});
app.post("/Join",cors(corsOptions), (req, res) => {
  const { email, name, password, Address, number } = req.body;
  console.log(number);
  const access = false
  const vendor = new RV({
    email,
    name,
    password,
    Address,
    access,
    number,
  });
  vendor.save();
});
app.post("/CheckVendor",cors(corsOptions), (req, res) => {
  const { email, password } = req.body;
  RV.findOne({ email, password }, function (err, noerr) {
    if (err) {
      console.log(err);
    }
    if (noerr) {
      res.json(noerr);
    }
  });
});
// Listening
app.listen(port, async () => {
  try {
    await mongoose.connect("mongodb+srv://demo:vuwV6K7Y2dMLX9U@cluster0.wbmpc.mongodb.net/test?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log(`Database Connected & App running in port ${port}`);
  } catch {
    console.log(`Database is't Connected & App is't running `);
  }
});
