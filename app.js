/* app.js */

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var mysql = require('mysql');

var app = express();

app.use(express.static(__dirname));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'secret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var mypassport = require('./passport.js');

var htmldir = __dirname + '/public/html';

app.get('/', function (req, res) {
  res.sendFile(htmldir + '/index.html');
});

app.get('/login', function (req, res) {
  res.sendFile(htmldir + '/login.html');
});

app.post('/register',  
	  passport.authenticate('local-register', 
	  								{  successRedirect: '/',
	                                   failureRedirect: '/login',
	                                   failureFlash: true })
);

var connection = mysql.createConnection({
  host     : process.env.HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DATABASE
});

connection.connect();
connection.query("select * from users", function(err, rows) {
	if (err) {
		console.error(err);
	} else {
		console.log("users", rows);
	}
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});