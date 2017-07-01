var mongoose = require('mongoose');
var express = require('express');
//Express Router used to define routes
var productRouter = express.Router();

var productModel = mongoose.model('Product');
var responseGenerator = require('./../../libs/responseGenerator');
var fs = require('fs');
var auth = require('./../../middlewares/auth');

module.exports.controller = function (app) {
    //Create Product Screen
    productRouter.get('/create/screen/',auth.checkAdminLogin, function (req, res) {
        res.render('productcreate');
    })
    //Create Product Route
    productRouter.post('/create/',auth.checkAdminLogin, function (req, res) {
        if (req.body.productName != undefined && req.body.price != undefined) {
            var newProduct = new productModel({
                name: req.body.productName,
                price: req.body.price,
                shortDescription: req.body.shortDescription,
                fullDescription: req.body.fullDescription,
                seller: req.body.seller
            });
            newProduct.save(function (err) {
                if (err) {
                    var myResponse = responseGenerator.generate(true,
                        "Oops some went wrong " + err, 500, null);
                    // res.send(myResponse);
                    res.render('error', {
                        message: myResponse.message,
                        error: myResponse.data
                    });
                } else {
                    var myResponse = responseGenerator.generate(false, null, 200,
                        newProduct);
                    res.redirect('/products/list');
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
    //Get End User Product List Screen
    productRouter.get('/all/screen', function (req, res) {
        res.render('products');
    });
    //Get Product List Route
    productRouter.get('/all/', function (req, res) {
        productModel.find(function (err, products) {
            if (err) {
                var myResponse = responseGenerator.generate(true,
                    "Oops some went wrong " + err, 500, null);
                // res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
            } else {
                var myResponse = responseGenerator.generate(false, null, 200, products);
                res.render('products', { products: myResponse.data });
                //   res.send(myResponse.data);
            }
        });
    });

    //Get Product List Route for Admin
    productRouter.get('/list/',auth.checkAdminLogin, function (req, res) {
        productModel.find(function (err, products) {
            if (err) {
                var myResponse = responseGenerator.generate(true,
                    "Oops some went wrong " + err, 500, null);
                // res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
            } else {
                var myResponse = responseGenerator.generate(false, null, 200, products);
                res.render('productlist', { products: myResponse.data });
                //   res.send(myResponse.data);
            }
        });
    });

    //Delete Product
    productRouter.get('/deleteProduct/:id',auth.checkAdminLogin,function(req,res){
        var id=req.params.id;

        productModel.remove({_id:id},function(err,response){
               if (err) {
                var myResponse = responseGenerator.generate(true,
                    "Oops some went wrong " + err, 500, null);
                // res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
            } else {
               
                var myResponse = responseGenerator.generate(false, null, 200, response);
                res.render('message');
                
               // res.send("Deleted Successfully");
            } 
        });
    });

    //Edit Product Screen
    productRouter.get('/editproduct/screen/:id',auth.checkAdminLogin,function(req,res){
        productModel.findOne({_id:req.params.id},function(err,response){
              if (err) {
                var myResponse = responseGenerator.generate(true,
                    "Oops some went wrong " + err, 500, null);
                // res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
            } else {
                var myResponse = responseGenerator.generate(false, null, 200, response);
                res.render('productedit',{product:myResponse.data});
            }
            //res.send(response);
        });
    });

    //Update Product Route
    productRouter.post('/:id/update',auth.checkAdminLogin,function(req,res){
        
        var update= req.body;
        update.updatedOn=Date.now();
        productModel.findOneAndUpdate({_id:req.params.id},update, { new: true },function(err,response){
            if (err) {
                var myResponse = responseGenerator.generate(true,
                    "Oops some went wrong " + err, 500, null);
                // res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });
            } else {
                
                var myResponse = responseGenerator.generate(false, null, 200, response);
                res.render('message');
                
              //  res.send(response);
            }
            
        });
        
    });
   
    app.use('/products', productRouter);
}