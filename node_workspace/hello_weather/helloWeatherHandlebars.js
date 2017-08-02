/**
 * Filename: helloExpress.js Author: Daniel Stoyer Date: Jul 24, 2017
 */

var expressFunc = require('express');

var expressApp = expressFunc();

var handleBars = require('express-handlebars').create({
	defaultLayout : 'main',
	helpers: {'getColor': function(temp, otherTemp){
		console.log("helper temperature: "+temp);
		console.log("helper other temp: "+otherTemp);
		if (temp > otherTemp) {
			return 'red';
		} else {
			return 'green';
		}
	}}
});

var request = require('request');

expressApp.engine('handlebars', handleBars.engine);
// expressApp.set('view.engine', 'handlebars') allows us to omit the
// ".handlebars" extention from the render(...) function calls
// e.g. res.render('home.handlebars') --> res.render('home')
expressApp.set('view engine', 'handlebars');
expressApp.set('port', 3500);

expressApp.get('/', function(req, res) {
					var context = {};
					request('http://api.openweathermap.org/data/2.5/weather?q=corvallis&units=imperial&APPID=aa224681db2a563756dd2041bc0eb5ca',
						function(err, response, body) {
							if (!err && response.statusCode < 400) {
								var owmData = JSON.parse(body);
								console.log("temperature: "+owmData.main.temp);
								console.log(body);
								context.owmJSON = owmData;
								context.owm = body;
								context.temp = owmData.main.temp
								res.render('home', context);
							} else {
								if (response) {
									console.log(response.statusCode);
								}
							next(err);
						}
					});
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