var express = require('express');
var config = require('./config');
var app = express();

var mongoose = require('mongoose');
mongoose.connect(config.mongoURL);

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Welcome to cryptomessenger');
});

app.post('/createUser', function(request, response) {
	  
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
