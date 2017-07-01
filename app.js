var express = require('express');
var app = express();
//Calling mongoose module
var mongoose = require('mongoose');
var logger = require('morgan');
// path is used the get the path of our files on the computer
var path = require('path');
// module for maintaining sessions
var session = require('express-session');

app.use(logger('dev'));

var bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

//Initialization of Session
app.use(session({
    name: 'myCustomCookie',
    secret: 'myAppSecret',
    resave: true,
    httpOnly: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

//Initialization of Cart Session
var cart = require('./libs/cartGenerator');
app.use(function(req,res,next){
var currentCart=req.session.cart;
console.log(currentCart);
req.session.cart=cart.cartModel(currentCart);
next();
});

// set the templating engine 
app.set('view engine', 'jade');

//set the views folder
app.set('views', path.join(__dirname + '/app/views'));

//Define the configuration of the database
var dbPath = "mongodb://localhost/myShop";

//Command to connect with database
db = mongoose.connect(dbPath);

mongoose.connection.once('open', function () {
    console.log("Database connection open success");
});

//fs module, by default module for file management 
var fs = require('fs');

//Include all our models
fs.readdirSync('./app/models').forEach(function (file) {
    //Check if file is JS format
    if (file.indexOf('.js')) {
        require('./app/models/' + file);
    }
}); //End For Each

//Include Controllers
fs.readdirSync('./app/controllers').forEach(function (file) {
    if (file.indexOf('.js')) {
        //Include a file as a route variable
        var route = require('./app/controllers/' + file);
        //Call Controller function of each file and pass
        //your app instance to it
        route.controller(app);
    }
}); //End For Each

//Including Auth File
//app level middleware for setting logged in user.
var userModel = mongoose.model('User');

app.use(function (req, res, next) {
    if (req.session && req.session.user) {
        userModel.findOne({ 'email': req.session.user.email }, function (err, user) {

            if (user) {
                req.user = user;
                delete req.user.password;
                req.session.user = user;
                 app.locals.user = req.session.user
                delete req.session.user.password;
                next();
            }

        });
    }
    else {
        app.locals.user=null;
        next();
    }

});//end of user login

app.listen(3000, function () {
    console.log('My Shop app listening on port 3000!');
});

