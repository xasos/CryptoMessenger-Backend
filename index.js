var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

mongoose.connect(config.mongoURL, function(error) {
	if (error) {
		console.log(error);
	}
});

// Mongoose Schema Definition
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    phoneNumber: String,
    publicKey: String
});

// Mongoose Model definition
var Users = mongoose.model('users', UserSchema);

app.get('/', function(request, response) {
	response.send('Welcome to CryptoMessenger!');
});

app.post('/createuser', function(req, res) {
	Users.findOne({phoneNumber: req.body.phoneNumber}, function(err, user) {
		if (err) return handleError(err);
		if (user) {
			res.writeHead(403, "Forbidden", {'Content-Type': 'text/html'});
			res.json({"error": "User already exists"});
		} else {
			var newUser = new Users({ phoneNumber: req.body.phoneNumber, publicKey: req.body.publicKey });
			newUser.save(function() {
				if (err) return handleError(err);
				res.writeHead(200, "User Successfully Added", {'Content-Type': 'text/html'});
			});
		}
	});
});

app.get('/getuser/:phoneNumber', function(req, res) {
	Users.findOne({phoneNumber: req.params.phoneNumber}, function(err, user) {
		if (err) return handleError(err);
		if (user) {
			res.json({ phoneNumber: user.phoneNumber, publicKey: user.publicKey });
		}
	});
});

app.post('/deleteuser', function(req, res) {
  response.send('Hello World!');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
