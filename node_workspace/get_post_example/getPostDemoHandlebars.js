/**
 * Filename: helloExpress.js
 * Author: Daniel Stoyer
 * Date: Jul 24, 2017
 */

var expressFunc = require('express');

var expressApp = expressFunc();

var handleBars = require('express-handlebars').create(
{
	defaultLayout:'main',
	helpers: { // helper function to display a list of parameters
		'list': function(items, options){
		var output = "<ul>\n";
		for (var i = 0, l = items.length; i < l; i++) {
			output = output + "\t<li>" + options.fn(items[i]) + "</li>\n";
		}
		return output + "</ul>\n";
		}
	}
});


expressApp.engine('handlebars', handleBars.engine);
// expressApp.set('view.engine', 'handlebars') allows us to omit the ".handlebars" extention from the render(...) function calls
// e.g. res.render('home.handlebars') --> res.render('home')
expressApp.set('view engine', 'handlebars'); 
expressApp.set('port', 3500);

// set up for posting both JSON and url encoded
var bodyParser = require('body-parser');
expressApp.use(bodyParser.urlencoded({extended: false}));
expressApp.use(bodyParser.json());

//expressApp.post('/', function(req, res){
//	res.render('home'); // 
//});

expressApp.get('/',function(req,res){
	var queryParams = [];
	for (var p in req.query){
		queryParams.push({'param':p,'value':req.query[p]})
	}
	var context = {};
	context.queryList = queryParams;
	context.requestDescription = "GET Request Received";
	res.render('data-page', context);
});

expressApp.post('/',function(req,res){
	var bodyParams = [];
	for (var p in req.body){
		bodyParams.push({'param':p,'value':req.body[p]});
	}
	
	var queryParams = [];
	for (var q in req.query) {
		queryParams.push({'param':q, 'value':req.query[q]});
	}
	var context = {};
	context.bodyList = bodyParams;
	context.queryList= queryParams;
	context.requestDescription = "POST Request Received";
	res.render('data-page', context);
});

expressApp.use(function(req,res){
res.status(404);
res.render('404');
});

expressApp.use(function(err, req, res, next){
console.error(err.stack);
res.type('plain/text');
res.status(500);
res.render('500');
});

expressApp.listen(expressApp.get('port'), function(){
  console.log('Express started on http://localhost:' + expressApp.get('port') + '; press Ctrl-C to terminate.');
});

