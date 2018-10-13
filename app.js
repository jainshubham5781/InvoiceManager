var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer	 = require('multer');
var morgan = require('morgan'); // for log file
var fs = require('fs');
var mongoose = require('mongoose'); // for mongoDb connection
var mongoStore = require('connect-mongo')(session); // for store session on mongo db
var promise = require('promise'); // Try Catch
var helmet = require('helmet'); // secure apps by setting various HTTP headers
var cors = require('cors'); // // enable CORS - Cross Origin Resource Sharing
var compress = require('compression'); // gzip compression


//var bcrypt = require('bcrypt'); // encryption
//Passport

global.__base = __dirname + '/';

var config = require(__base + 'config/config.js');
var app = express();
//var http = require('http').Server(app);

//Set path to view files
var viewPath = path.join(__dirname,'views');
app.set('views', './views');
app.set('view engine', 'pug');

app.use(compress());
app.use(helmet());
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(multer({dest: config.multerPath}).any());

//Morgan Middleware to log requests
var logStream = fs.createWriteStream(path.join(__dirname,'access.log'), {flags: 'a'});
app.use(morgan('tiny', {stream: logStream}));



var server = app.listen(config.port, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log(host + ":" + port);
})

// var io = require('socket.io').listen(server);

// io.on('connection', function(socket){
//   console.log("socket is connected");
//   socket.broadcast.emit('hi');
//   socket.emit('message', { message: 'welcome to the chat' });
//     socket.on('send', function (data) {
//       console.log(data);
//         io.sockets.emit('message', data);
//     });
//   socket.on('disconnect', function(){
//     console.log('socket disconnected');
//   })
// })


mongoose.connect(config.mongoDBConnectionString);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));




//Set session and cookie
app.use(cookieParser());
//app.use(session({secret: config.sessionKey, saveUninitialized: true, resave: true, cookie: {secure: true}}));
app.use(session({
  secret: config.sessionKey, 
  saveUninitialized: false, 
  resave: false,
  store: new mongoStore({
    mongooseConnection: db
  })
}));

var router = require('./routes/route.js');
app.use(function(err, req, res, next){
  console.log(err);
  console.log(req.url);
  res.send('Request URL not found - ' + err);
});
app.use('/', router);
