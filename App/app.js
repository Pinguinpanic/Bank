/**
 * This is responsible for starting the application.
 */

//Load Express and put it into our App
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var mapOfIds = [];

function getNewId(){
	var newId = 10000 +Math.round(Math.random()*89999);
	while(newId in mapOfIds) {
		newId = 10000 +Math.round(Math.random()*89999)
	}
	//Mark that we are using this
	mapOfIds[newId]=1;
	return newId;
};

//Open ears to port 3000, giving a yell if succesfull
app.listen(3000, function() {
	console.log('Beep Boop Banking on port 3000');
});

app.post('/account',function(req,res) {
	var name = req.body.name;
	if(typeof req.body.name == 'undefined' || req.body.name==null || req.body.name== ''){
		res.status(400).send('You forgot to send the name.');
	}
	else {
		res.status(200).send({
			'name':name,
			'balance':0,
			'id':getNewId()
		});
	}
});