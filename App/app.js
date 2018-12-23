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

var innerState = [];

//Open ears to port 3000, giving a yell if succesfull
app.listen(3000, function() {
	console.log('Beep Boop Banking on port 3000');
});

app.post('/account',function(req,res) {
	if(typeof req.body.name == 'undefined' || req.body.name==null || req.body.name== ''){
		res.status(400).send('You forgot to send the name.');
	}
	else {
		var name = req.body.name;
		var newEntry = {
			'name':name,
			'balance':0,
			'id':getNewId()
		};
		innerState[newEntry.id]=newEntry;
		res.status(200).send(newEntry);
	}
});

app.get('/account/:id',function(req,res) {
	if(typeof req.params.id == 'undefined' || req.params.id==null){
		res.status(400).send('You forgot to give a request id.');
	}
	else {
		var id = req.params.id;
		if(!(id in innerState)) {
			res.status(400).send('Requesting none existing id '+id);
		}
		else {
			res.status(200).send(innerState[id]);
		}
	}
});

app.post('/account/:id/deposit',function(req,res) {
	if(typeof req.params.id == 'undefined' || req.params.id==null){
		res.status(400).send('You forgot to give a request id.');
	}
	else if(typeof req.body.amount == 'undefined' || req.body.amount==null){
		res.status(400).send('You forgot to send the amount to deposit.');
	}
	else {
		var id = req.params.id;
		if(!(id in innerState)) {
			res.status(400).send('Trying to deposit for none existing account with id '+id);
		}
		else if(req.body.amount<=0) {
			res.status(400).send('Requested deposit amount is not >0');
		}
		else {
			innerState[id].balance+=req.body.amount;
			res.status(200).send(innerState[id]);
		}
	}
});