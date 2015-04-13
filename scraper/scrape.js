var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var app = express();
var htmldir = __dirname;

app.get('/', function(req, res) {
	res.sendFile(htmldir + '/index.html');
});

app.get('/index.html', function(req, res) {
	res.sendFile(htmldir + '/index.html');
});

app.get('/scrape', function(req, res) {
	var url = 'http://www.imdb.com/title/tt1229340/';

	request(url, function(error, response, html) {
		if (!error) {
			console.log(html);
			var $ = cheerio.load(html);
			var scrapedData = {};
			$('.header').filter(function() {
				var data = $(this);
				scrapedData.title = data.children().first().text();
			});

			$('.star-box').filter(function() {
				var data = $(this);
				scrapedData.rating = data.children().first().text();
			});
			console.log(scrapedData);
		} else {
			// TODO
			console.log(error);
			res.send("Error message son!");
		}
	});
});

app.listen('8081');

exports = module.exports = app;