/**
 * This is responsible for starting the application.
 */

//Load Express and put it into our App
var express = require("express");
var app = express();

//Open ears to port 3000, giving a yell if succesfull
app.listen(3000, function() {
	console.log("Beep Boop Banking on port 3000");
});