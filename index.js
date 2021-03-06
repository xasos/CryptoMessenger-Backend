var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

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
    phoneNumber: { type: String, required: true, min: 1 },
    publicKey: { type: String, required: true, min: 1 }
});

// Mongoose Model Definition
var Users = mongoose.model('user', UserSchema);

app.get('/test', function(request, response) {
	Users.find(function(err, user) {
		response.send(user);
	});
});

// Define Routes
app.get('/', function(request, response) {
	response.send('Welcome to CryptoMessenger!');
});

// Route to create user
app.post('/createuser', function(req, res) {
	// Check to see if user exists
	users.find({ phoneNumber: req.body.phoneNumber }, function(err, user) {
		if (err) return handleError(err); // Handle error
		// Handle if user exists
		if (user) {
			res.send(403).json({error: "User already exists"});
		} else {
			// Create user from route parameters and add to database
			var newUser = new Users({ phoneNumber: req.body.phoneNumber, publicKey: req.body.publicKey });
			newUser.save(function() {
				if (err) return handleError(err);
				res.status(200).json({ message: "User Successfully Added" });
			});
		}
	});
});

// Route to get user data 
app.get('/getuser/:phoneNumber', function(req, res) {
	// Find user in database using phone number as key
	Users.findOne({ phoneNumber: req.params.phoneNumber}, function(err, user) {
		if (err) return handleError(err); // Handle Error
		// If user exists return data
		if (user) {
			res.json({ phoneNumber: user.phoneNumber, publicKey: user.publicKey });
		} else {
			res.status(404).json({ message: "User Doesn't Exist" });			
		}
	});
});

// Route to delete user from database
app.delete('/deleteuser/:phoneNumber', function(req, res) {
	// Uses phone numbers as key to find user in database and delete
	Users.findOneAndRemove({phoneNumber: req.body.phoneNumber}, function(err, user) {
		if (err) return handleError(err);
		res.writeHead(200, "User Successfully Deleted", {'Content-Type': 'text/html'});
	});
});

// Listen on specified port
app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'));
});
