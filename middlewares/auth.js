var mongoose=require('mongoose');
var userModel=mongoose.model('User');

//App level middleware to set request user
//To check valid user
exports.setLoggedInUser=function(req,res,next){
    if(req.session && req.session.user){
        userModel.findOne({'email':req.session.user.email},function(err,user){
            if(user){
			//	req.user = user;
				 
				req.session.user = user;
                delete req.user.password;
				next()
			}
			else{
				// do nothing , because this is just to set the values
			}
        });
    } else {
        next();
    }
}

exports.checkLogin = function(req,res,next){

	if(!req.user && !req.session.user){
		res.redirect('/users/login/screen');
	}
	else{

		next();
	}

}// end checkLogin

exports.checkAdminLogin = function(req,res,next){

	if(!req.user && !req.session.user){
		res.redirect('/users/login/screen');
	}
	else if(req.session.user.userType==1){

		next();
	} else {
		res.redirect('/users/login/screen');
	}

}// end checkLogin