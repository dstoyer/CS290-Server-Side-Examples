/**
 * Filename: get_post.js
 * Author: Daniel Stoyer
 * Date: Jul 24, 2017
 */

/**
 * Filename: helloExpress.js
 * Author: Daniel Stoyer
 * Date: Jul 24, 2017
 */

var expressFunc = require('express');
var expressApp = expressFunc();
var handleBars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
expressApp.use(bodyParser.urlencoded({extended: false}));
expressApp.use(bodyParser.json());
expressApp.use(expressValidator());

expressApp.engine('handlebars', handleBars.engine);
// expressApp.set('view.engine', 'handlebars') allows us to omit the ".handlebars" extention from the render(...) function calls
// e.g. res.render('home.handlebars') --> res.render('home')
expressApp.set('view engine', 'handlebars'); 
expressApp.set('port', 3500);

expressApp.get('/', function(req, res){
	res.render('home') // 
});

expressApp.get('/get-data',function(req, res) {
	var queryParams = [];
	for (var p in req.query) {
		queryParams.push({'name':p, 'value': req.query[p]});
	}
	var context = {};
	context.getResult = queryParams;
	res.render('get-data', context);
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