var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "bob",
  password: "bob123",
  database: "cs290"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("DROP TABLE IF EXISTS todo", function(err){
	var createString = "CREATE TABLE todo(" +
	"id INT PRIMARY KEY AUTO_INCREMENT," +
	"name VARCHAR(255) NOT NULL," +
	"done BOOLEAN," +
	"due DATE)";
	con.query(createString, function(err){
		if (err) throw err;
		console.log("Table reset");
		return;
	});
  });
//  con.query("SELECT USER FROM todo", function(err, result) {
//	  if(err) throw err;
//	  console.log("Result: " + result);
//  });
});