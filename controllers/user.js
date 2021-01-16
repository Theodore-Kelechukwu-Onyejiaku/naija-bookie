const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validation = require("../middlewares/validation/login_signupValidation");
const User = require("../models/user");
const cookie = require("cookie-parser");
const async = require("async");
var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');

/**
 *      FOR /users/signup
 */
exports.getSignup = (req, res, next) => {
    res.render("signup", {title: "SignUp"})
}
exports.singnup = async (req, res, next) => {
    try {

      let body = req.body;

      //if signup username and password fail validation
      const { error } = await validation.validate(req.body);
      if (error) {
        var err = new Error(error.details[0].message);
        res.render("signup", {error: err, title: "SignUp", body: body})
      }
  
      let user = await User.findOne({ username: req.body.username });
      //If user already exists in database
      if (user) {
        res.render("signin", {error: "Username already exits in database", title: "SignUp", body: body})
      }
  
      var salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      var newUser = new User({
        username: req.body.username,
        password: hashPassword,
      });
  
      await newUser.save();
      res.render("signin", {message: "SignUp Successful!", title: "SignIn"})
    } catch (error) {
      next(error);
    }
  };
  
  /**
   *  @desc
   *  @route POST /users/signin
   *  @access PUBLIC
   */
  exports.signin = async (req, res, next) => {
    let body = req.body;
    try {
      //if signup username and password fail validation
      const { error } = await validation.validate(req.body);
      if (error) {
        var err = new Error(error.details[0].message);
        err.status = 404;
        return res.render("signin", {error: err, title: "SignIn", body: body})
      }
      let user = await User.findOne({ username: req.body.username });
  
      if (!user) {
        return res.render("signin", {error: "Username or password incorrect!", title: "SignIn", body: body})
      }
  
     
      var passwordCorrect = await bcrypt.compare(req.body.password, user.password);

      //If password does not match
      if (!passwordCorrect) {
        console.log("Password doesn't match")
        return res.render("signin", {error: "Username or password incorrect!", title: "SignIn", body: body})
      }
  
      //Create and assign Token
      var token = await jwt.sign(user.toJSON(), process.env.TOKEN_SECRET, {
        expiresIn: "10m",
      });
  
      res.cookie('auth', token);
      res.cookie("browserToken", token);
      if(req.cookies.protectedUrl !== undefined){
        console.log("The requested url:", req.cookies.protectedUrl);
        return res.redirect(req.cookies.protectedUrl);
      }

    
   
    res.redirect("/");
     
    } catch (error) {
      res.render("signIn", {error: error, title: "SignIn", body: body})
    }
  };
  
  /**
   *      FOR /users/logout
   */

  exports.getSignIn = async (req, res, next) => {
    res.render("signin", {title: "SignIn"});
  }

  exports.logout = async (req, res, next) => {
    res.clearCookie("auth");
    res.clearCookie("browserToken");
    res.redirect("/");
  };