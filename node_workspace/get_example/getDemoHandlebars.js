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

expressApp.get('/', function(req, res){
	res.render('home'); // 
});

expressApp.get('/other-page', function(req, res) {
	res.render('other-page');
});

//function getData() {
//	var context= {};
//	context.sentData = req.query.myData;
//	return context;
//}

expressApp.get('/show-data', function(req, res) {
	var context= {};
	context.sentData = req.query.myData;
	res.render('show-data', context);
});

expressApp.get('/get-loopback',function(req,res){
	var qParams = [];
	for (var p in req.query){
		qParams.push({'name':p,'value':req.query[p]})
	}
	var context = {};
	context.dataList = qParams;
	res.render('get-loopback', context);
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