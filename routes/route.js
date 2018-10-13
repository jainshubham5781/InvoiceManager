var express = require('express');
var router = express.Router();
var config = require(__base + 'config/config.js');
const { check, validationResult } = require('express-validator/check');

var register = require('./register.js');
var home = require('./home.js');
var invoice = require('./invoice.js');
//var transaction = require('./transaction.js');

router.use(function(req, res, next){
	res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	next();
});

router.get('/', register.index);

router.get('/login', register.login_display);

router.post('/login', 
	//[check('email').isEmail().withMessage('Must be an email').trim().normalizeEmail()],
	register.login);


router.get('/signup', register.signup_display);

router.post('/signup', [
	//check('email').isEmail().withMessage('Must be an email').trim().normalizeEmail(),
	check('password').isLength({min:4}),
	check('passwordConf').exists().custom((value,{req}) => value === req.body.password)
		.withMessage('Password & ConfirmPassword Not Equal'),
	check('username').exists().not().isEmpty().trim()
	],
	register.signup);

router.get('/logout', register.logout);

router.use('/home', register.checkSignIn
	, function(err, req, res, next){
		console.log(err);
		res.redirect('/login');
	}
)
router.get('/home', home.home_display);

router.route('/createInvoice')
	.get(invoice.create_invoice_display)
	.post(invoice.create_invoice);

router.get('/viewInvoice', invoice.view_invoice_display);
router.post('/deleteInvoice', invoice.delete_invoice);
router.post('/downloadPdf', invoice.downloadPdf);


// router.get('*', function(req, res, next) {
// 	next(new Error('404'));
// });

module.exports = router;