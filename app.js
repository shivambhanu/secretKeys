require("dotenv").config();  //Should be always at top.
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

// console.log(process.env.SECRET);

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res)=>{
    res.render("home");
});

app.route("/login")
.get((req, res)=>{
    res.render("login");
})
.post((req, res)=>{
    // User.findOne({email: req.body.username, password: req.body.password})
    // .then((doc)=>{
    //     console.log(doc);
    //     if(doc){
    //         res.render("secrets");
    //     }else{
    //         res.send("You need to Register first!");
    //     }
    // })
    User.findOne({email: req.body.username})
    .then((doc)=>{
        // console.log(doc);
        if(doc){
            if(doc.password === req.body.password){
                console.log(doc.password);
                res.render("secrets");
            }else{
                res.send("Wrong Password");
            }
        }else{
            res.send("You need to Register first!");
        }
    })
    .catch((err)=>{
        res.send(err);
    });
});

app.route("/register")
.get((req, res)=>{
    res.render("register");
})
.post((req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save();
    res.render("secrets");
});

app.listen(3000, ()=>{
    console.log("Server started at port 3000");
});
