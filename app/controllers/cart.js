var mongoose = require('mongoose');
var express = require('express');
//Express Router used to define routes
var productRouter = express.Router();

var productModel = mongoose.model('Product');
var responseGenerator = require('./../../libs/responseGenerator');
var myCart = require('./../../libs/cartGenerator');
var auth = require('./../../middlewares/auth');
var fs = require('fs');

module.exports.controller = function (app) {
    //Router to Add product to cart
    productRouter.get("/addtocart/:id", function (req, res) {

        productModel.findOne({ '_id': req.params.id }, function (err, result) {
            if (err) {
                var myResponse = responseGenerator.generate(true, "Oops Something went wrong " + err,
                    500, "");
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
            }
            else if (result == undefined || result == null || result == "") {
                var myResponse = responseGenerator.generate(true, "Product doesnt exist",
                    403, "");
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
            }
            else {
                //Cart Logic
                var currentCart=req.session.cart;
                req.session.cart=myCart.addOrUpdateCart(currentCart,result);
                console.log("Cart Updated");
                console.log(req.session.cart.items.length);
                res.redirect("/cart/cartList");

            }
        });

    });
    //Show list of cart items
    productRouter.get('/cartList',function(req,res){
        res.render('cart',{myCart:req.session.cart})
    });
    //Remove Product from cart
    productRouter.get('/removeProduct/:id',function(req,res){
        var currentCart=req.session.cart;
        req.session.cart=myCart.removeItemFromCart(currentCart,req.params.id);
        res.redirect("/cart/cartList");
    });

    app.use('/cart', productRouter);
}