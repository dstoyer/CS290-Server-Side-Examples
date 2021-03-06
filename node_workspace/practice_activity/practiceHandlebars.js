/**
 * Filename: helloExpress.js
 * Author: Daniel Stoyer
 * Date: Jul 24, 2017
 */

var expressFunc = require('express');

var expressApp = expressFunc();

var handleBars = require('express-handlebars').create({
	defaultLayout : 'main',
	helpers: {'getColor': function(minTemp, toDoTemp){
		if (minTemp < toDoTemp) {
			return 'green';
		} else {
			return 'red';
		}
	}}
});

var request = require('request');

expressApp.engine('handlebars', handleBars.engine);
// expressApp.set('view.engine', 'handlebars') allows us to omit the ".handlebars" extention from the render(...) function calls
// e.g. res.render('home.handlebars') --> res.render('home')
expressApp.set('view engine', 'handlebars');
expressApp.set('port', 3500);

var session = require('express-session');
var bodyParser = require('body-parser');
expressApp.use(bodyParser.urlencoded({extended: false}));
expressApp.use(session({
	"secret" : "SuperSecretPassword",
	"resave" : "false",
	"saveUninitialized" : "false"
}));

expressApp.get('/', function(req, res, next) {
	var context = {};
	//If there is no session, go to the main page.
	if (!req.session.name) {
		res.render('newSession', context);
		return;
	}
	context.name = req.session.name;
	context.city = req.session.city;
	context.temp = req.session.temp;
	context.toDoCount = req.session.toDoList.length || 0;
	context.toDoList = req.session.toDoList || [];
	console.log('app.get: '+context.toDoList);
	res.render('toDo', context);
});

expressApp.post('/', function(req, res) {
	var context = {};

	if (req.body['New List']) {
		req.session.name = req.body.name;
		req.session.city = req.body.city;
		req.session.temp = req.body.temp;
		req.session.toDoList = [];
		req.session.curId = 0;
	}

	//If there is no session, go to the main page.
	if (!req.session.name) {
		res.render('newSession', context);
		return;
	}
	if (req.body['Add Item']) {
		request('http://api.openweathermap.org/data/2.5/weather?q='+req.body.city+'&units=imperial&APPID=aa224681db2a563756dd2041bc0eb5ca',
				function(err, response, body) {
					if (!err && response.statusCode < 400) {
						var owmData = JSON.parse(body);
						req.session.toDoList.push({
							"name" : req.body.name,
							"city" : req.body.city,
							"temp" : req.body.temp,
							"owmTemp" : owmData.main.temp,
							"id" : req.session.curId
						});
						// Increase the id for the next to-do
						req.session.curId++;
						// the context needs to be updated with the session information here because
						// we want to render the page in this request block.
						context.name = req.session.name;
						context.city = req.session.city;
						context.temp = req.session.temp;
						context.toDoCount = req.session.toDoList.length;
						context.toDoList = req.session.toDoList;
						console.log(context.toDoList);
						res.render('toDo', context);
					} else {
						if (response) {
							console.log(response.statusCode);
						}
					next(err);
				}
			});
		// we make sure that the post does not continue because the page is rendered in the request block.
		return;
	}

	if (req.body['Done']) {
		req.session.toDoList = req.session.toDoList.filter(function(e) {
			return e.id != req.body.id;
		})
	}
	
	// the POST was either for a new list, or to remove a to-do
	// we need to update the context and render the page.
	context.name = req.session.name;
	context.city = req.session.city;
	context.temp = req.session.temp;
	context.toDoCount = req.session.toDoList.length;
	context.toDoList = req.session.toDoList;
	console.log(context.toDoList);
	res.render('toDo', context);
});

expressApp.use(function(req, res) {
	res.status(404);
	res.render('404');
});

expressApp.use(function(err, req, res, next) {
	console.error(err.stack);
	res.type('plain/text');
	res.status(500);
	res.render('500');
});

expressApp.listen(expressApp.get('port'), function() {
	console.log('Express started on http://localhost:' + expressApp.get('port')
			+ '; press Ctrl-C to terminate.');
});

function getCityTemperature(res, city) {
	request('http://api.openweathermap.org/data/2.5/weather?q='+city+'&units=imperial&APPID=aa224681db2a563756dd2041bc0eb5ca',
		function(err, response, body) {
			if (!err && response.statusCode < 400) {
				var owmData = JSON.parse(body);
				console.log("temperature: "+owmData.main.temp);
				console.log(body);
				return owmData.main.temp
			} else {
				if (response) {
					console.log(response.statusCode);
				}
			next(err);
		}
	});
}