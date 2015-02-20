var express = require('express');
var app = express();
//var mongoose = require('mongoose');
//var config = require('./config');

//mongoose.connect('mongodb://localhost/my_database');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.post('/createUser', function(request, response) {
  response.send('Hello World!');
});

app.get('/readUser', function(request, response) {

}

app.post('/deleteUser', function(request, response) {
  response.send('Hello World!');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
