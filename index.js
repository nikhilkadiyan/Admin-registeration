const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose= require('mongoose');
const bcrypt= require('bcrypt');
const saltRounds=10;

mongoose.connect('mongodb://127.0.0.1:27017/ResultDB');

const port=7000;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const adminSchema = {
    email: String,
    password: String
}

const Admin = mongoose.model('Admin',adminSchema);

app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.post("/register",(req,res)=>{
    const reqemail = req.body.email;
    const reqpassword=req.body.password;
    Admin.findOne({email: reqemail}).then((data)=>{
        if(data === null){
            bcrypt.hash(reqpassword, saltRounds, function(err, hash) {
                const newAdmin = new Admin({email: reqemail,password: hash});
                newAdmin.save().then(()=> console.log("New Admin registered"));
            });
            res.render("index.ejs",{message: "Admin registered"});
        }else{
            res.render("index.ejs",{message: "Email id already registered"});
        }
    });
});


app.listen(port,function(){
    console.log(`Admin server running on port ${port}`);
});