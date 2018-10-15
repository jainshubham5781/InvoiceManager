var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var promise = require('promise');
var Counter = require(__base + 'models/counter');
var Item = require(__base + 'models/item');

var InvoiceSchema = new mongoose.Schema({
  email: {
  	type: String, 
  	unique: true, 
  	required: true, 
  	trim: true
  },
  invoiceHistory: {
    invoiceNumber: {type: String, unique: true, required: true, trim: true},
    custName: {type: String, required: true, trim: true},
    custAddress: {type: String, required: true, trim: true},
    date: {type: Date, default: new Date()},
    totalAmount: {type: Number, min: 0},
    paidAmount: {type: Number, min: 0},
    state: {type: String, trim: true, enum: ['Draft', 'Sent']}
   //  ,
   //  items:[{
	  // 	type: mongoose.Schema.Types.ObjectId,
	  // 	ref: 'Item'
  	// }]
  }
});

InvoiceSchema.statics.saveInvoice = function(query, update, options){
	return new Promise(function(resolve, reject){
		Invoice.findOneAndUpdate(query, update, options)
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


InvoiceSchema.statics.editInvoice = function(query, update){
	return new Promise(function(resolve, reject){
		Invoice.findOneAndUpdate(query, update)
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



InvoiceSchema.statics.findInvoiceByEmail = function(query, projection, options){
	return new Promise(function(resolve, reject){
		Invoice.findOne(query, projection)
		.sort(options)
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

InvoiceSchema.statics.deleteInvoice = function(query, update){
	return new Promise(function(resolve, reject){
		Invoice.findOneAndUpdate(query, update)
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

var Invoice = mongoose.model('Invoice', InvoiceSchema);
module.exports = Invoice;

