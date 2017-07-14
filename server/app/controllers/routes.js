var express = require('express');
var Router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Ticket = mongoose.model('Ticket');
var resGenerator = require('./../../libs/resGenerator');
var validator = require('./../../middlewares/validator');

//defining token...
var token;
// used to create, sign, and verify tokens
var jwt = require('jsonwebtoken');

//json secret key
var jsonSecret = "97hw9a73hr2q@#$#@mo8afjoeidha0e8doh";

//route to login
Router.post('/login', validator.login, function(req, res) {
  //search for entered email id in mongodb
  User.findOne({
    email: req.body.email
  }, function(error, user) {

    // console.log("user : "+user);

    if (error) {
      var err = resGenerator.generate(true, "Something is not working : " + error, 500, null);
      res.json(err);
    } else if (user === null || user === undefined || user.name === null || user.name === undefined) {
      var response = resGenerator.generate(true, "No user found !! Check email and try again... ", 400, null);
      res.json(response);
    } else if (!user.compareHash(req.body.password)) {
      var response = resGenerator.generate(true, "Wrong password!! Check password and try again...", 401, null);
      res.json(response);
    } else {

      //creating jwt token for user to authenticate other requests
      token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60),
        id:user._id,
        email: user.email,
        name: user.name,
        mobileNumber:user.mobileNumber
      }, jsonSecret
      );

      var response = resGenerator.generate(false, "Logged in Successfully", 200, user);
      response.token = token;
      res.json(response);
    }

  });

});
 // end login route

//route to signup
Router.post('/signup', validator.signup, function(req, res) {

  //check if email id already exists and flag if exists
  User.findOne({email: req.body.email}, function(error, user) {

    if (error) {
    	//console.log("error");
      var err = resGenerator.generate(true, "Something is not working, error  : " + error, 500, null);
      res.json(err);
    } else if (user) {
    	//console.log("user");
      var err = resGenerator.generate(true, "email  already exists, please Login", 400, null);
      res.json(err);
    } else {

      //new user instance
      var newUser = new User({

        name: req.body.name,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber
      });
      newUser.password = newUser.generateHash(req.body.password);

      //saving user data in mongodb
      newUser.save(function(error) {
        if (error) {
          var response = resGenerator.generate(true, "Some error occured : " + error, 500, null);
          res.json(response);
        } else {

         token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        id:newUser._id,
        email: newUser.email,
        name: newUser.name,
        mobileNumber:newUser.mobileNumber
      }, jsonSecret
      );

          var response = resGenerator.generate(false, "Successfully signed up", 200, newUser);
          response.token = token;
          res.json(response);
        }
      });
    }
  });

});
//end signup route

//exporting Routes
module.exports = Router;
