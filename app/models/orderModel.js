var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var orderSchema=new Schema({
    orderedBy:{type:String,default:'',required:true},
    createdOn:{type:Date,default:Date.now()},
    createdOn:{type:Date,default:Date.now()},
    items:{},
    totalQuantity:{type:Number,default:0},
    totalAmount:{type:String,default:''},
    status:{type:Number,default:0},
    phoneNumber:{type:Number,default:0},
    address1:{type:String,default:''},
    address2:{type:String,default:''},
    city:{type:String,default:''},
    state:{type:String,default:''},
    zip:{type:Number,default:''}
});

mongoose.model('Order',orderSchema);