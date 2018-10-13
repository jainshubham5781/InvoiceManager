var mongoose = require('mongoose');

var CounterSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    seq_value: { type: Number, default: 0 }
});

CounterSchema.statics.getNextSeqValue = function(query, update, options){
	return new Promise(function(resolve, reject){
		Counter.findOneAndUpdate(query, update, options)
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




var Counter = mongoose.model('Counter', CounterSchema);
module.exports = Counter;

