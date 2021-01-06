const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
require("dotenv").config();

exports.verifyUser = (req, res, next)=>{
    
    var token = req.cookies.auth;

    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, (err, token_data)=>{
            if(err){
                res.render("signin", {error: "You must signin to view this page", title: "SignIn"})
            }else{
                req.user = token_data
                next();
            }
        })
    }else{
        var err = new Error();
        res.cookie("protectedUrl", req.url);
        res.render("signin", {error: "You are not authenticated! Please signin to continue", title: "SignIn"})
    }
}

exports.verifyAdmin = (req, res, next)=>{
    if(req.user.admin){
      return  next()
    }
    var err = new Error("You are not authorized!");
        err.status = 403;
        next(err);
}