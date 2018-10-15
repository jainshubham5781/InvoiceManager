var Counter = require(__base + 'models/counter');
var User = require(__base + 'models/user');
var Invoice = require(__base + 'models/invoice');
var Item = require(__base + 'models/item');
var mongoose = require('mongoose');
var pdf = require('html-pdf');
var config = require(__base + 'config/config.js');

exports.create_invoice_display = function(req, res){
	console.log('CreateInvoicePage');	
	var decodedMessage = '';
	if(req.query.message)
		decodedMessage = Buffer.from(req.query.message, 'base64').toString('ascii');
	res.render('CreateInvoice', {message: decodedMessage});
}

exports.create_invoice = function(req, res){
	console.log('CreateInvoice');
	console.log(req.body);

	if(req.body.paidAmount < 0){
		res.render('CreateInvoice', {message: "Amount should be greater than 0!"});
	}
	else{
		var invoiceTotalAmount = 0;
		const itemArray = new Promise(function(resolve, reject){
			var itemsData = [];
			if(!Array.isArray(req.body.itemName)){
				var itemtotalAmount = parseInt(parseInt(req.body.price) + (parseInt(req.body.tax)*parseInt(req.body.price)*0.01) - parseInt(req.body.discount)*parseInt(req.body.quantity));  
				invoiceTotalAmount = invoiceTotalAmount + itemtotalAmount;
				var itemData = {
					itemId : "I0",
					itemName : req.body.itemName,
					quantity : req.body.quantity,
					price : req.body.price,
					discount : req.body.discount,
					tax: req.body.tax,
					totalAmount: itemtotalAmount
				}
				itemsData.push(itemData);
			}
			else{
				var itemLength = req.body.itemName.length;
				for(var i = 0; i < itemLength; i++){
					var itemtotalAmount = parseInt(parseInt(req.body.price[i]) + (parseInt(req.body.tax[i])*parseInt(req.body.price[i])*0.01) - parseInt(req.body.discount[i]))*parseInt(req.body.quantity[i]);  
					invoiceTotalAmount = invoiceTotalAmount + itemtotalAmount;
					var itemData = {
						itemId : "I" + i,
						itemName : req.body.itemName[i],
						quantity : req.body.quantity[i],
						price : req.body.price[i],
						discount : req.body.discount[i],
						tax: req.body.tax[i],
						totalAmount: itemtotalAmount
					}
					itemsData.push(itemData);
				}
			}
			resolve(itemsData);
		});

		var middleFunc = async()=> {
			const result = await itemArray;
			return result;
		}
		middleFunc().then(itemsArray => {
			console.log(itemsArray);
			var seqName = 'invoiceNumber';
			var query = {_id: seqName},
				update = {$inc: { seq_value: 1} },
				options = { upsert: true, new: true, setDefaultsOnInsert: true};	
			Counter.getNextSeqValue(query, update, options).then(function(seqResult) {
			 	var invoiceNumber = seqResult.seq_value;
		     	var date = new Date();
		     	console.log(invoiceTotalAmount);
				var query = {email: req.session.email},
				    update = { 
				    	$push:{ 
				    		invoiceHistory: {
					    		invoiceNumber: invoiceNumber,
					    		custName: req.body.custName, 
					    		custAddress: req.body.custAddress, 
					    		state: req.body.state, 
					    		totalAmount: invoiceTotalAmount,
					    		paidAmount: req.body.paidAmount,
					    		date: date
					  		}
				    	}
				    },
					options = { upsert: true, new: true, setDefaultsOnInsert: true };
				Invoice.saveInvoice(query, update, options).then(function(invoiceResult) {
			    	console.log("Created: " + invoiceResult);
			  		var query = {invoiceNumber: invoiceNumber},
					    update = { 
					    	$push:{ 
					    		itemDetails: {
						    		$each: itemsArray
						  		}
					    	}
					    },
						options = { upsert: true, new: true, setDefaultsOnInsert: true };
					Item.saveItems(query, update, options).then(function(itemResult) {
				    	console.log("Created: " + itemResult);
				    }, function(err){
				    		console.log("Created: " + err);
					});

			    }, function(err){
			    		console.log("Created: " + err);
				});
				var message = "Created Successfully"
				var encodedMessage = Buffer.from(message).toString('base64');
				res.redirect('/createInvoice?message=' + encodedMessage);
		    }, function(err){
		    		console.log("getNextSequenceValue: " + err);
			});	
		})
		.catch(err=> {
			console.log("ERROR");
		});
	}
}

exports.view_invoice_display = function(req, res){
	console.log('View Invoice');	
	var query = {email: req.session.email},
		projection = {_id: 0, 'invoiceHistory': 1},
		options = {'invoiceHistory.$.invoiceNumber': 1};
	Invoice.findInvoiceByEmail(query, projection, options).then(function(result) {
    	console.log("InvoiceDetail: " + result);
    	var ob = JSON.stringify(result);
	    var obj = JSON.parse(ob);
    	if(result &&  obj.invoiceHistory.length != 0){
	    	var ob = JSON.stringify(result.invoiceHistory);
	    	//console.log(result);
	    	var obj = JSON.parse(ob);
	    	const itemArray = new Promise(function(resolve, reject){
	    		var itemsArray = [];
	    		var res11;
	    		for(var i in obj) {
					var query = {invoiceNumber: obj[i].invoiceNumber},
						projection = {_id: 0, 'invoiceNumber': 1, 'itemDetails': 1},
						options = '';
						res11 =  new Promise(function(resolve, reject){
							Item.findOne(query, projection)
							.exec(function(err, result){
								if(err){
									reject(err);
								}
								else if(result){
									itemsArray.push({ 'invoiceNumber': result.invoiceNumber, 'item': result.itemDetails});
									resolve(itemsArray);
								}
							});
						});
				}
				const middleFunc1 = async()=> {
		    		const tempResult = await res11;
					return tempResult;
				}
				middleFunc1().then(itemArray => {
					resolve(itemArray);	
				})
				.catch(err=> {
					console.log("ERROR" + err);
				});
			});
	    	
	    	const middleFunc = async()=> {
				const result = await itemArray;
				return result;
			}
			middleFunc().then(itemArray => {
				console.log(itemArray);
				console.log(itemArray[0].item);
		    	res.render('viewInvoice', {message: "All Invoices: ", invoiceResult: JSON.stringify(result.invoiceHistory), itemResult: JSON.stringify(itemArray)});
			})
			.catch(err=> {
				console.log("ERROR " + err);
			});
	    }
	    else{
	    	res.render('viewInvoice', {message: "All Invoices: "});  
	    }
	}, function(err){
    		console.log("InvoiceDetail: " + err);
	});
}

exports.delete_invoice = function(req,res){
	console.log("DeleteInvoice");
	console.log(req.body);

	var query = {email: req.session.email},
		update = { 
			    	$pull:{ 
			    		'invoiceHistory': {
				    		invoiceNumber: req.body.invoiceNumber
				  		}
			    	}
				};
	Invoice.deleteInvoice(query, update).then(function(invoiceResult) {
    	console.log("Invoice Delete: " + invoiceResult);
    	var query = {invoiceNumber: req.body.invoiceNumber};
		Item.deleteItems(query).then(function(itemResult) {
	    	console.log("Items Delete: " + itemResult);
	    	res.redirect('/viewInvoice');
	    }, function(err){
	    		console.log("Items Delete: " + err);
		});
    }, function(err){
    		console.log("invoice Delete: " + err);
	});
}


exports.downloadPdf = function(req, res){
	console.log("downloadPdf");
	//console.log(req.body);
	var invoiceDetail = JSON.parse(req.body.invoiceDetail);
	var itemDetail = JSON.parse(req.body.itemDetail);
	console.log(invoiceDetail);
	console.log(itemDetail);
	var options = { format: 'Letter' };
	var itemsStr = "";
	for(var item in itemDetail) {
		itemsStr = itemsStr + "<li>" + itemDetail[item].itemName + " | " + 
										itemDetail[item].quantity + " | " + 
										itemDetail[item].price + " | " + 
										itemDetail[item].tax + "% | " + 
										itemDetail[item].discount + " | " + 
										itemDetail[item].totalAmount + "</li>";
	}
	var htmlStr =config.pdfHtmlStr;
	htmlStr = htmlStr.replace("InvoiceNumber:", "InvoiceNumber: "+ invoiceDetail.invoiceNumber) 
				.replace("Date:", "Date: "+ invoiceDetail.date)
				.replace("CustomerName:", "CustomerName: "+ invoiceDetail.custName)
				.replace("CustomerAddress:", "CustomerAddress: "+ invoiceDetail.custAddress)
				.replace("InvoiceTotalAmount:", "InvoiceTotalAmount: "+ invoiceDetail.totalAmount)
				.replace("PaidAmount:", "PaidAmount: "+ invoiceDetail.paidAmount)
				.replace("State:", "State: "+ invoiceDetail.state)
				.replace("PendingAmount:", "PendingAmount: "+ parseInt(invoiceDetail.totalAmount - invoiceDetail.paidAmount))
				.replace("InsertData", itemsStr);

	var fileName = "./Invoice" + invoiceDetail.invoiceNumber+ ".pdf"; 
	pdf.create(htmlStr, options).toFile(fileName, function(err, res) {
  		if (err) 
  			return console.log(err);
  		else 
  			console.log(res);
  	});
	res.redirect('/viewInvoice');
}


exports.edit_invoice_display = function(req, res){
	console.log("Edit Invoice Page");
	console.log(req.query.editItem);
	console.log(req.query.editInvoice);
	var invoiceDetail = JSON.parse(req.query.editInvoice);
	res.render('editInvoice', {message: "Edit Invoice -" +invoiceDetail.invoiceNumber, invoiceResult: req.query.editInvoice, itemResult: req.query.editItem});

}

exports.edit_invoice = function(req, res){
	console.log("Edit Invoice");
	console.log(req.body);
	var invoiceTotalAmount = 0;
	
	const itemArray = new Promise(function(resolve, reject){
		var itemsData = [];
		var itemLength = req.body.itemName.length;
		for(var i = 0; i < itemLength; i++){
			var itemtotalAmount = (parseInt(req.body.price[i]) + parseInt(req.body.tax[i]*req.body.price[i]*0.01) - parseInt(req.body.discount[i]))*req.body.quantity[i];  
			invoiceTotalAmount = invoiceTotalAmount + itemtotalAmount;
			var itemData = {
				itemId : "I" + i,
				itemName : req.body.itemName[i],
				quantity : req.body.quantity[i],
				price : req.body.price[i],
				discount : req.body.discount[i],
				tax: req.body.tax[i],
				totalAmount: itemtotalAmount
			}
			itemsData.push(itemData);
		}
		resolve(itemsData);
	});

		var middleFunc = async()=> {
			const result = await itemArray;
			return result;
		}
		middleFunc().then(itemsArray => {

			 	var invoiceNumber = req.body.invoiceNumber;
			 	console.log(invoiceNumber.toString());
		     	var date = new Date();
				// var query = {email: req.session.email, "invoiceHistory.invoiceNumber" : invoiceNumber},
				//     update = {
				//     			$set: {
				// 		    		"invoiceHistory.$.custName": req.body.custName, 
				// 		    		"invoiceHistory.$.custAddress": req.body.custAddress, 
				// 		    		"invoiceHistory.$.state": req.body.state, 
				// 		    		"invoiceHistory.$.totalAmount": invoiceTotalAmount,
				// 		    		"invoiceHistory.$.paidAmount": req.body.paidAmount
				// 	    	}
				//     };
				// Invoice.editInvoice(query, update).then(function(invoiceResult) {
				var query = {email: req.session.email},
					update = { 
					    	$pull:{ 
					    		'invoiceHistory': {
						    		invoiceNumber: req.body.invoiceNumber
						  		}
					    	}
					};
				Invoice.editInvoice(query, update).then(function(invoiceResult) {
		    		console.log("Edited Invoice1: " + invoiceResult);
	    			var query = {email: req.session.email},
						update = { 
						    	$push:{ 
						    		invoiceHistory: {
						    		invoiceNumber: req.body.invoiceNumber,
						    		custName: req.body.custName, 
						    		custAddress: req.body.custAddress, 
						    		state: req.body.state, 
						    		totalAmount: invoiceTotalAmount,
						    		paidAmount: req.body.paidAmount,
						    		date: date
						  		}
						    }
					};
					Invoice.editInvoice(query, update).then(function(invoiceResult) {
				    	console.log("Edited Invoice2: " + invoiceResult);
				  		var query = {invoiceNumber: invoiceNumber},
						    update = { 
						    	$set:{ 
						    		itemDetails: itemsArray
						    	}
						    },
							options = '';
						Item.saveItems(query, update, options).then(function(itemResult) {
					    	console.log("Edited Items: " + itemResult);
							    		res.redirect('/home');
					    }, function(err){
					    		console.log("Edited Items: " + err);
						});
					 }, function(err){
			    		console.log("Edited Invoice2: " + err);
					});
			    }, function(err){
			    		console.log("Edited Invoice1: " + err);
				});
				//var message = "Edited Successfully"
				//var encodedMessage = Buffer.from(message).toString('base64');
				//res.redirect('/home');
		    
		})
		.catch(err=> {
			console.log("ERROR:"+ err);
		});





	
}