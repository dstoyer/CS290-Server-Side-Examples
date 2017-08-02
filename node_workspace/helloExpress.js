/**
 * Filename: helloExpress.js
 * Author: Daniel Stoyer
 * Date: Jul 24, 2017
 */

var expressFunc = require('express');

var expressApp = expressFunc();

expressApp.set('port', 3500);

expressApp.get('/', function(req,res) {
	res.type('text/plain');
	res.send('Welcome to the main page! '+Math.random());
});

expressApp.get('/other-page', function(req, res){
	res.type('text/plain');
	res.send('Welcome to the other page!');
});

expressApp.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

expressApp.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

expressApp.listen(expressApp.get('port'), function(){
  console.log('Express started on http://localhost:' + expressApp.get('port') + '; press Ctrl-C to terminate.');
});