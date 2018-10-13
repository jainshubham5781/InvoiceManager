var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var config = require(__base + 'config/config.js');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email Required'],
    trim: true
  },
  phoneNumber: {
  	type: String,
  	unique: true,
  	required: [true, 'Phone Number Required'],
  	validate: {
  		validator: function(v){
  			return /\d{10}/.test(v);
  		},
  		message: '{VALUE} is not a valid Phone Number!'
  	}
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 4
  }
});

UserSchema.statics.authenticate = function(email, password, next){
	User.findOne({email: email})
		.exec(function(err, user){
			if(err){
				next(err);
			}
			else if(!user){
				var err = new Error('User Not found');
				err.status = 401;	
				next(err);
			}
			else{
				bcrypt.compare(password, user.password, function(err, result){
					if(result === true){
						next(null, user);
					}
					else{
						next();
					}
				});
			}
		});
}

UserSchema.pre('save', function(next){
	var user = this;
	//bcryptSalt- no of rounds to hash 
	bcrypt.hash(user.password, config.bcryptSalt, function(err, hash){
		if(err){
		next(err);
		}
		user.password = hash;
		next();
	})
})

UserSchema.statics.findUserData = function(query, projection){
	return new Promise(function(resolve, reject){
		User.findOne(query, projection)
		.exec(function(err, result){
			if(err){
				reject(err);
			}
			else{
				resolve(result);
			}
		});
	});
}

var User = mongoose.model('User', UserSchema);
module.exports = User;