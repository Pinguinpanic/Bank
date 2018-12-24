/**
 * This script is responsible for starting the application, and (for now) has the guts of the application.
 */

//Load Express and put it into our App
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var mapOfIds = [];

/**
 * Generate a unique id in the range [10000...99999]
 */
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

/**
 * Post new acount with given name
 */
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
/**
 * Get state of an acount with given id
 */
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
/**
 * Post a deposit to an account with given id for a given amount
 */
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

/**
 * Post a withdrawal from an account with given id for a given amount
 */
app.post('/account/:id/withdraw',function(req,res) {
	if(typeof req.params.id == 'undefined' || req.params.id==null){
		res.status(400).send('You forgot to give a request id.');
	}
	else if(typeof req.body.amount == 'undefined' || req.body.amount==null){
		res.status(400).send('You forgot to send the amount to withdraw.');
	}
	else {
		var id = req.params.id;
		if(!(id in innerState)) {
			res.status(400).send('Trying to withdraw for none existing account with id '+id);
		}
		else if(req.body.amount<=0) {
			res.status(400).send('Requested withdraw amount is not >0');
		}
		else {
			if(req.body.amount>innerState[id].balance) {
				res.status(400).send('Requested withdraw amount is higher then the balance.');
			}		
			else {
				innerState[id].balance-=req.body.amount;
				res.status(200).send(innerState[id]);
			}
		}
	}
});

/**
 * Post a transfer from an account with given id for a given amount to an account with given receiverid
 */
app.post('/account/:id/send',function(req,res) {
	if(typeof req.params.id == 'undefined' || req.params.id==null){
		res.status(400).send('You forgot to give a request id.');
	}
	else if(typeof req.body.amount == 'undefined' || req.body.amount==null){
		res.status(400).send('You forgot to send the amount to send.');
	}
	else if(typeof req.body.receiverid == 'undefined' || req.body.receiverid==null){
		res.status(400).send('You forgot to send the receiverid to send to.');
	}
	else {
		var id = req.params.id;
		var idTo = req.body.receiverid;
		if(!(id in innerState)) {
			res.status(400).send('Trying to send for none existing account with id '+id);
		}
		else if (!(idTo in innerState)) {
			res.status(400).send('Trying to send to none existing account with id '+idTo);
		}
		else if (idTo == id) {
			res.status(400).send('Can not transfer from account to itself');
		}
		else if(req.body.amount<=0) {
			res.status(400).send('Requested transfer amount is not >0');
		}
		else {
			if(req.body.amount>innerState[id].balance) {
				res.status(400).send('Requested transfer amount is higher then the balance.');
			}		
			else {
				innerState[id].balance-=req.body.amount;
				innerState[idTo].balance+=req.body.amount;
				res.status(200).send(innerState[id]);
			}
		}
	}
});


