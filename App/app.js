/**
 * This script is responsible for starting the application.
 */

//Load Express and put it into our App
var express = require('express');
var app = express();
//Set parser to use JSON
var bodyParser = require('body-parser');
app.use(bodyParser.json());
//Load account.js for use as router for accounts.
var accountRouter = require('./routes/account.js');
app.use('/account',accountRouter);

//Open ears to port 3000, giving a yell if succesfull
app.listen(3000, function() {
	console.log('Beep Boop Banking on port 3000');
});