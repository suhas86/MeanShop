//Include Mongoose
var mongoose = require('mongoose');
//Scheme Object
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userName: { type: String, default: ''},
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, default: '',required:true,unique:true },
    mobileNumber: { type: Number, default: '' },
    password: { type: String, default: '' },
    userType:{type:Number,default:2}
});

mongoose.model('User',userSchema);