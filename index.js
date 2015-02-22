var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');
var app = express();

// Set port to listen on and define public route
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// Connect to database from config file
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

// Mongoose Model Definition
var Users = mongoose.model('users', UserSchema);

// Define Routes
app.get('/', function(request, response) {
	response.send('Welcome to CryptoMessenger!');
});

// Route to create user
app.post('/createuser', function(req, res) {
	// Check to see if user exists
	Users.findOne({phoneNumber: req.body.phoneNumber}, function(err, user) {
		if (err) return handleError(err); // Handle error
		// Handle if user exists
		if (user) {
			res.writeHead(403, "Forbidden", {'Content-Type': 'text/html'});
			res.json({"error": "User already exists"});
		} else {
			// Create user from route parameters and add to database
			var newUser = new Users({ phoneNumber: req.body.phoneNumber, publicKey: req.body.publicKey });
			newUser.save(function() {
				if (err) return handleError(err);
				res.writeHead(200, "User Successfully Added", {'Content-Type': 'text/html'});
			});
		}
	});
});

// Route to get user data 
app.get('/getuser/:phoneNumber', function(req, res) {
	// Find user in database using phone number as a key
	Users.findOne({phoneNumber: req.params.phoneNumber}, function(err, user) {
		if (err) return handleError(err); // Handle Error
		// If user exists return data
		if (user) {
			res.json({ phoneNumber: user.phoneNumber, publicKey: user.publicKey });
		} else {
			res.writeHead(404, "User Doesn't Exist", {'Content-Type': 'text/html'});
		}
	});
});

app.delete('/deleteuser/:phoneNumber', function(req, res) {
	Users.findOneAndRemove({phoneNumber: req.body.phoneNumber}, function(err, user) {
		if (err) return handleError(err);
		res.writeHead(200, "User Successfully Deleted", {'Content-Type': 'text/html'});
	});
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});