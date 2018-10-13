var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
  invoiceNumber:{
  	type: String, unique: true, required: true, trim: true
  },
  itemDetails:{
  	 itemId: {
	    type: String,
	    required: true,
	    trim: true
	  },
	  itemName: {
	    type: String,
	    required: [true, 'Name Required'],
	    trim: true
	  },
	  quantity: {
	  	type: Number, 
	    min: 0,
	    default: 1
	  },
	  price: {
	  	type: Number, 
	    min: 0,
	    default: 0
	  },
	  discount: {
	    type: Number, 
	    min: 0,
	    default: 0
	  },
	  tax: {
	    type: Number, 
	    min: 0,
	    default: 0
	  },
	  totalAmount: {
	    type: Number, 
	    min: 0,
	    default: 0
 	 }
 	}
});


// ItemSchema.statics.saveItems = function(itemData){
// 	return new Promise(function(resolve, reject){
// 		Item.insertMany(itemData, function(err, result){
// 			if(err){
// 				reject(err);
// 			}
// 			else{
// 				resolve(result);
// 			}
// 		});
// 	});
// }

ItemSchema.statics.saveItems = function(query, update, options){
	return new Promise(function(resolve, reject){
		Item.findOneAndUpdate(query, update, options)
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

ItemSchema.statics.findItemByInvoiceNumber = function(query, projection, options){
	return new Promise(function(resolve, reject){
		Item.findOne(query, projection)
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

ItemSchema.statics.deleteItems = function(query){
	return new Promise(function(resolve, reject){
		Item.findOneAndRemove(query)
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

var Item = mongoose.model('Item', ItemSchema);
module.exports = Item;