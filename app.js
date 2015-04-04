var express = require('express');
var app = express();

app.use(express.static(__dirname));

var htmldir = __dirname + '/public/html';

app.get('/', function (req, res) {
  res.sendFile(htmldir + '/index.html');
});

app.get('/login', function (req, res) {
  res.sendFile(htmldir + '/login.html');
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
