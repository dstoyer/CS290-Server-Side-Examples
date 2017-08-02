/**
 * Filename: helloExpress.js
 * Author: Daniel Stoyer
 * Date: Jul 24, 2017
 */

//var pool = mysql.createPool({
//	host: 'localhost',
//	user: 'bob',
//	password: 'bob123',
//	database: 'cs290'
//});
//
//module.exports.pool = pool;
//
//console.log(pool);

var expressFunc = require('express');
var mysql = require('./dbcon.js');

var expressApp = expressFunc();

var handleBars = require('express-handlebars').create({defaultLayout:'main'});

expressApp.engine('handlebars', handleBars.engine);
// expressApp.set('view.engine', 'handlebars') allows us to omit the ".handlebars" extention from the render(...) function calls
// e.g. res.render('home.handlebars') --> res.render('home')
expressApp.set('view engine', 'handlebars'); 
expressApp.set('port', 3500);

// set up for posting both JSON and url encoded
//var bodyParser = require('body-parser');
//expressApp.use(bodyParser.urlencoded({extended: false}));
//expressApp.use(bodyParser.json());

//expressApp.post('/', function(req, res){
//	res.render('home'); // 
//});

expressApp.get('/',function(req,res,next){
	  var context = {};
	  mysql.pool.query('SELECT * FROM todo', function(err, rows, fields){
	    if(err){
	      next(err);
	      return;
	    }
	    context.results = JSON.stringify(rows);
	    res.render('home', context);
	  });
	});

expressApp.get('/reset-table',function(req,res){
	var context = {};
	mysql.pool.query("DROP TABLE IF EXISTS todo", function(err) {
		var createString = "CREATE TABLE todo(" +
				"id INT PRIMARY KEY AUTO_INCREMENT," +
				"name VARCHAR(255) NOT NULL," +
				"done BOOLEAN," +
				"due DATE)";
		mysql.pool.query(createString, function(err) {
			context.results = "Table reset";
			res.render('home', context);
		});
	});
});

expressApp.get('/insert',function(req,res){
	var context = {};
	mysql.pool.query("INSERT INTO todo (`name`) VALUES (?)", [req.query.c], function (err, result){
		if(err) {
			next(err);
			return;
		}
		context.results = "Inserted id " + result.insertId;
		res.render('home', context);
	});
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

