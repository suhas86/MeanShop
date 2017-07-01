var mongoose = require('mongoose');
var express = require('express');
//Express Router used to define routes
var orderRouter = express.Router();

var orderModel = mongoose.model('Order');
var responseGenerator = require('./../../libs/responseGenerator');
var myCart = require('./../../libs/cartGenerator');
var auth = require('./../../middlewares/auth');
var fs = require('fs');

module.exports.controller = function (app) {
    //Checkout Page
    orderRouter.get('/checkout', auth.checkLogin, function (req, res) {
        var currentCart = req.session.cart;
        res.render('checkout', { myCart: currentCart });
    });

    //Place Order
    orderRouter.post('/placeOrder', function (req, res) {
        var cart = req.session.cart;
        var user = req.session.user;

        var newOrder = new orderModel({
            orderedBy: user.email,
            createdOn: Date.now(),
            items: cart.items,
            totalQuantity: cart.totalQuantity,
            totalAmount: cart.subTotal,
            phoneNumber: req.body.phoneNumber,
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip
        });

        newOrder.save(function (err) {
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
                    200, newOrder);
                delete req.session.cart;    
                res.render('success', {
                    message: myResponse.newOrder
                });
            }
        });
    });

    //Get Order List
    orderRouter.get('/getOrderList',function(req,res){
        orderModel.find(function(err,response){
            if (err) {
                var myResponse = responseGenerator.generate(true,
                    "Oops some went wrong " + err, 500, null);
                // res.send(myResponse);
                res.send(myResponse.data);
            } else {
                var myResponse = responseGenerator.generate(false, "",
                    200, response);
                res.send(myResponse.data);
            }
        });
        
    });

    app.use('/order', orderRouter);
}