//var Transaction = require(__base + 'models/transaction');
var User = require(__base + 'models/user');

exports.home_display = function(req, res){
	console.log("home_display");
	return res.render('home', {message: "Welcome " + req.session.user});
	// Transaction.findOne({email: req.session.email}, {walletAmount: 1, _id: 0}, function(err, result){
	// 	if(err){
	// 		console.log(err);
	// 		next(err);
	// 	}
	// 	else if(!result){
	// 		console.log(result);
	// 		return res.render('home', {message: "Welcome " + req.session.user, walletAmount: "Wallet Amount: " + '0'});
	// 	}
	// 	else{
	// 		console.log(result);
	// 		return res.render('home', {message: "Welcome " + req.session.user, walletAmount: "Wallet Amount: " + result.walletAmount});	
	// 	}
	//});
}

// exports.profile_display = function(req, res){
// 	console.log('ProfilePage');
// 	var query = {email: req.session.email},
// 			projection = {_id: 0, email: 1, username: 1, phoneNumber: 1};
// 	User.findUserData(query, projection).then(function(result){
// 		if(result){
// 			var query = {email: req.session.email},
// 				projection = {_id: 0, 'walletAmount': 1},
// 				options = '';
// 			Transaction.findTransactionByEmail(query, projection, options).then(function(amount) {
// 				console.log(amount);
// 				console.log(result);
// 				res.render('profile', {message: 'Hello '+result.username, amount: amount, result: result });
// 			});

// 		}
// 		else{
// 			res.render('profile', {message: 'Something went wrong' });
// 		}
		
// 	});
	
// }