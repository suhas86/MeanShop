var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var productSchema=new Schema({

    name:{type:String,default:'',required:true},
    price:{type:Number,default:0,required:true},
    shortDescription:{type:String,default:''},
    fullDescription:{type:String,default:''},
    seller:{type:String,default:''},
    images:[],
    createdOn:{type:Date,default:Date.now()},
    updatedOn:{type:Date,default:Date.now()}

});

mongoose.model('Product',productSchema);