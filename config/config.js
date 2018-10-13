module.exports = {
	sessionKey : "Your secret key",
	mongoDBConnectionString : 'mongodb://localhost:27017/ShipwavesDB',
	port : 8082,
	multerPath : '/tmp/',
	bcryptSalt:  10,
	pdfHtmlStr: `<html>
			<head><title>Invoices</title></head>
			<body>
				<h4>Invoice Details: </h4>
				<ul>
					<li>InvoiceNumber:</li>
					<li>Date:</li>
					<li>CustomerName:</li>
					<li>CustomerAddress:</li>
					<br/>
					<li>Item Details:- </li>
					<li>ItemName | Quantity | Price | tax% | Discount | TotalAmount </li>
					<hr/>
					InsertData
					<hr/>
					<li>InvoiceTotalAmount:</li>
					<li>PaidAmount:</li>
					<li>State:</li>
					<li>PendingAmount:</li>
				</ul>
				<hr/><hr/><br/><br/>				
			</body>
		</html>`
};
