/**
 * Filename: helloExpress.js
 * Author: Daniel Stoyer
 * Date: Jul 24, 2017
 */

var expressFunc = require('express');

var expressApp = expressFunc();

var handleBars = require('express-handlebars').create({defaultLayout:'main'});

expressApp.engine('handlebars', handleBars.engine);
// expressApp.set('view.engine', 'handlebars') allows us to omit the ".handlebars" extention from the render(...) function calls
// e.g. res.render('home.handlebars') --> res.render('home')
expressApp.set('view engine', 'handlebars'); 
expressApp.set('port', 3500);

// set up for posting both JSON and url encoded
var bodyParser = require('body-parser');
expressApp.use(bodyParser.urlencoded({extended: false}));
expressApp.use(bodyParser.json());

expressApp.post('/', function(req, res){
	res.render('home'); // 
});

expressApp.post('/post-loopback',function(req,res){
	var bParams = [];
	for (var p in req.body){
		bParams.push({'name':p,'value':req.body[p]});
	}
	
	var qParams = [];
	for (var q in req.query) {
		qParams.push({'name':q, 'value:':req.query[q]});
	}
	var context = {};
	context.bodyList = bParams;
	context.queryList= qParams;
	res.render('post-loopback', context);
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