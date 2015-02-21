var express = require('express');
var pg = require('pg');
var config = require('./config');
var app = express();

var conString = config.postgresURL;

//var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/my_database');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Welcome to cryptomessenger');
});

app.post('/createUser', function(request, response) {
	  pg.connect(conString, function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query('SELECT $1::int AS number', ['1'], function(err, result) {
	    //call `done()` to release the client back to the pool
	    done();

	    if(err) {
	      return console.error('error running query', err);
	    }
	    console.log(result.rows[0].number);
	    //output: 1
	  });
	});
});

app.get('/readUser', function(request, response) {
	// poll user

});

app.post('/deleteUser', function(request, response) {
  response.send('Hello World!');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
