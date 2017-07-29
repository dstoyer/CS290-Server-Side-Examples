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
		console.log("getColor min temp: "+minTemp);
//		console.log("getColor city temp: "+owmData.main.temp);
//		console.log(body);
		if (minTemp < 100) {
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
//	var toDo = {};
//	toDo.name = req.body.name;
//	toDo.city = req.body.city;
//	toDo.temp = req.body.temp;
//
//	toDo.id   = req.session.curId;
	if (req.body['Add Item']) {
		req.session.toDoList.push({
			"name" : req.body.name,
			"city" : req.body.city,
			"temp" : req.body.temp,
			"id" : req.session.curId
		});
//		console.log("Add Item owmTemp: ["+toDo.owmTemp+"]");
//		req.session.toDoList.push(toDo);
		req.session.curId++;
	}

	if (req.body['Done']) {
		req.session.toDoList = req.session.toDoList.filter(function(e) {
			return e.id != req.body.id;
		})
	}

	context.name = req.session.name;
	context.city = req.session.city;
	context.temp = req.session.temp;
	context.toDoCount = req.session.toDoList.length;
	context.toDoList = req.session.toDoList;
	console.log(context.toDoList);
	res.render('toDo', context);
	
	// do the request to Open Weather and change the background color
//	getCityTemperature(res, context);
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

		
//	var context = {};
	request('http://api.openweathermap.org/data/2.5/weather?q='+city+'&units=imperial&APPID=aa224681db2a563756dd2041bc0eb5ca',
		function(err, response, body) {
			if (!err && response.statusCode < 400) {
				var owmData = JSON.parse(body);
				console.log("temperature: "+owmData.main.temp);
				console.log(body);
//				context.owmJSON = owmData;
//				context.owm = body;
				return owmData.main.temp
//				res.render('toDo', context);
			} else {
				if (response) {
					console.log(response.statusCode);
				}
			next(err);
		}
	});

}