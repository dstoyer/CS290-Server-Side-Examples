/**
 * Filename: helloExpress.js
 * Author: Daniel Stoyer
 * Date: Jul 24, 2017
 */

var expressFunc = require('express');

var expressApp = expressFunc();

var handleBars = require('express-handlebars').create({
	defaultLayout : 'main'
});

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
	context.toDoCount = req.session.toDo.length || 0;
	context.toDo = req.session.toDo || [];
	console.log(context.toDo);
	res.render('toDo', context);
});

expressApp.post('/', function(req, res) {
	var context = {};

	if (req.body['New List']) {
		req.session.name = req.body.name;
		req.session.city = req.body.city;
		req.session.temp = req.body.temp;
		req.session.toDo = [];
		req.session.curId = 0;
	}

	//If there is no session, go to the main page.
	if (!req.session.name) {
		res.render('newSession', context);
		return;
	}

	if (req.body['Add Item']) {
		req.session.toDo.push({
			"name" : req.body.name,
			"city" : req.body.city,
			"temp" : req.body.temp,
			"id" : req.session.curId
		});
		req.session.curId++;
	}

	if (req.body['Done']) {
		req.session.toDo = req.session.toDo.filter(function(e) {
			return e.id != req.body.id;
		})
	}

	context.name = req.session.name;
	context.city = req.session.city;
	context.temp = req.session.temp;
	context.toDoCount = req.session.toDo.length;
	context.toDo = req.session.toDo;
	console.log(context.toDo);
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