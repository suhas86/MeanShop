var mongoose = require('mongoose');
var express = require('express');
//Express Router used to define routes
var userRouter = express.Router();

var userModel = mongoose.model('User');
var responseGenerator = require('./../../libs/responseGenerator');
var fs = require('fs');
var auth = require('../../middlewares/auth');
module.exports.controller = function (app) {
    //Signup Screen
    userRouter.get('/signup/screen', function (req, res) {
        res.render('signup')
    })
    //Sign Up Route
    userRouter.post('/signup/', function (req, res) {
        if (req.body.firstName != undefined && req.body.lastName != undefined
            && req.body.password != undefined && req.body.email != undefined) {
            var newUser = new userModel({
                userName: req.body.firstName + '' + req.body.lastName,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobileNumber: req.body.mobileNumber,
                password: req.body.password,
                userType: 2
            });
            
            newUser.save(function (err) {
                if (err) {
                    var myResponse = responseGenerator.generate(true,
                        "Oops some went wrong " + err, 500, null);
                    // res.send(myResponse);
                    res.render('error', {
                        message: myResponse.message,
                        error: myResponse.data
                    });
                } else {
                    var myResponse = responseGenerator.generate(false, "",
                        200, newUser);

                    req.session.user = newUser;
                    delete req.session.user.password;
                    req.user = newUser;
                    delete req.user.password;
                     app.locals.user = req.session.user
                    res.redirect('/cart/cartList');
                }
            });
        } else {
            var myResponse = responseGenerator.generate(true,
                "Please enter mandatory fields", 403, null);
            res.render('error', {
                message: myResponse.message,
                error: myResponse.data
            });
        }
    });
    //Login Screen
    userRouter.get('/login/screen/', function (req, res) {
        res.render('login');
    });
    //Login Route
    userRouter.post('/login/', function (req, res) {

        if (req.body.email != undefined && req.body.password != undefined) {
            userModel.findOne({ $and: [{ 'email': req.body.email }, { 'password': req.body.password }] },
                function (err, foundUser) {
                    if (err) {
                        var myResponse = responseGenerator.generate(true, "Oops Something Went Wrong " + err,
                            500, null);
                        //  res.send(myResponse);
                        res.render('error', {
                            message: myResponse.message,
                            error: myResponse.data
                        });
                    } else {
                        if (foundUser == null || foundUser == undefined) {
                            var myResponse = responseGenerator.generate(true, "Please check your email and password ",
                                404, null);
                            // res.send(myResponse);
                            res.render('error', {
                                message: myResponse.message,
                                error: myResponse.data
                            });
                        } else {
                            var myResponse = responseGenerator.generate(false, "",
                                200, foundUser);
                            req.session.user = foundUser;
                            delete req.session.user.password;
                            req.user = foundUser;
                            delete req.user.password;
                             app.locals.user = req.session.user
                            if(foundUser.userType!=1){
                            res.redirect('/cart/cartList');
                            } else {
                            res.redirect('/products/list');    
                            }
                        }
                    }
                });
        }

    });
    //Logout Route
    userRouter.get('/logout',function(req,res){

    req.session.user = null;
    app.locals.user=null;
    res.redirect('/users/login/screen');
  });
    app.use('/users', userRouter);
}