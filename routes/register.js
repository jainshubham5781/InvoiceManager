var User = require(__base + 'models/user');
const { check, validationResult } = require('express-validator/check');

exports.index = function(req, res) {
	console.log('App Started')
	res.redirect('/home');
}

exports.login_display = function(req, res){
	console.log('loginPage');
	res.render('login');
}

exports.login = function(req, res){
	console.log('loginPost');
	if(!req.body.email || !req.body.password){
		res.render('login', {message: "Please enter both Id and Password"});
	}
	else{
		User.authenticate(req.body.email, req.body.password, function(err, user){
			if(err || !user){
				res.render('login', {message: "Invalid Credentials"});
			}
			else{
				req.session.email = user.email;
				req.session.user = user.username;
				console.log(req.session);
				res.redirect('/home');
			}
		})
	}
}

exports.signup_display = function(req, res){
	console.log('signupPage');
	res.render('signup');
}

exports.signup = function(req, res, next){
	console.log('signupPost');
	var errors = validationResult(req);
	console.log(errors.isEmpty());
	console.log(errors.array());
	//console.log(errors.mapped());
	//console.log(errors.formatWith());
	//console.log(errors.throw());
	
	if(!errors.isEmpty()){
		return res.json({errors: errors.array()})
	}
	if(!req.body.username || !req.body.email || !req.body.password || !req.body.passwordConf){
		res.render('signup', {message: "Please enter all fields"});
	}
	else if(req.body.password != req.body.passwordConf){
		res.render('signup', {message: "Password and Confirm Password not same"});
	}
	else{
		var query = {email: req.body.email},
			projection = {_id: 1};
		User.findUserData(query).then(function(result){
			console.log("User: " + result);
			if(result){
				res.render('signup', {message: "User already exists"});
			}
			else{
				var userData = {
					email : req.body.email,
					username : req.body.username,
					password : req.body.password,
					phoneNumber : req.body.phoneNumber
				}
				User.create(userData, function(err, user){
					if(err){
						console.log('Signup: ', err.message)
						next(err);
					}
					else{
						res.render('login', {username: req.body.username, email: req.body.email, password: req.body.password});
					}
				})
			}
	    }, function(err){
	    		console.log("User: " + err);
	    		next(err);
		});	    
	}
}

exports.logout = function(req, res){
	req.session.destroy(function(){
		console.log('User Logged Out');
	});
	res.redirect('/');
}

exports.checkSignIn = function(req, res, next){
	console.log('checkSignIn');
	if(req.session && req.session.email){
		next();
	}
	else{
		var err = new Error("Not Logged In!");
		next(err);
	}
}

