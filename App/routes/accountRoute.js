/**
 * This routes the account endpoint to it's correct functionality.
 * Which for now is right here.
 */
var express = require('express');
var router = express.Router();

//Use direct memory implementation of Account for now.
var Account = require('./../impl/accountMemory.js');

/**
 * Post new acount with given name
 */
router.post('/',function(req,res) {
	if(typeof req.body.name == 'undefined' || req.body.name==null || req.body.name== ''){
		res.status(400).send('You forgot to send the name.');
	}
	else {
		var name = req.body.name;
		var newEntry = new Account(name);
		res.status(200).send(Account.getRepresentation(newEntry.id));
	}
});
/**
 * Get state of an acount with given id
 */
router.get('/:id',function(req,res) {
	if(typeof req.params.id == 'undefined' || req.params.id==null){
		res.status(400).send('You forgot to give a request id.');
	}
	else {
		var id = req.params.id;
		if(! Account.exists(id)) {
			res.status(400).send('Requesting none existing id '+id);
		}
		else {
			res.status(200).send(Account.getRepresentation(id));
		}
	}
});
/**
 * Post a deposit to an account with given id for a given amount
 */
router.post('/:id/deposit',function(req,res) {
	if(typeof req.params.id == 'undefined' || req.params.id==null){
		res.status(400).send('You forgot to give a request id.');
	}
	else if(typeof req.body.amount == 'undefined' || req.body.amount==null){
		res.status(400).send('You forgot to send the amount to deposit.');
	}
	else {
		var id = req.params.id;
		if(! Account.exists(id)) {
			res.status(400).send('Trying to deposit for none existing account with id '+id);
		}
		else if(req.body.amount<=0) {
			res.status(400).send('Requested deposit amount is not >0');
		}
		else {
			Account.deposit(id,req.body.amount);
			res.status(200).send(Account.getRepresentation(id));
		}
	}
});

/**
 * Post a withdrawal from an account with given id for a given amount
 */
router.post('/:id/withdraw',function(req,res) {
	if(typeof req.params.id == 'undefined' || req.params.id==null){
		res.status(400).send('You forgot to give a request id.');
	}
	else if(typeof req.body.amount == 'undefined' || req.body.amount==null){
		res.status(400).send('You forgot to send the amount to withdraw.');
	}
	else {
		var id = req.params.id;
		if(! Account.exists(id)) {
			res.status(400).send('Trying to withdraw for none existing account with id '+id);
		}
		else if(req.body.amount<=0) {
			res.status(400).send('Requested withdraw amount is not >0');
		}
		else {
			if(req.body.amount>Account.getBalance(id)) {
				res.status(400).send('Requested withdraw amount is higher then the balance.');
			}		
			else {
				Account.withdraw(id,req.body.amount);
				res.status(200).send(Account.getRepresentation(id));
			}
		}
	}
});

/**
 * Post a transfer from an account with given id for a given amount to an account with given receiverid
 */
router.post('/:id/send',function(req,res) {
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
		if(! Account.exists(id)) {
			res.status(400).send('Trying to send for none existing account with id '+id);
		}
		else if (! Account.exists(idTo)) {
			res.status(400).send('Trying to send to none existing account with id '+idTo);
		}
		else if (idTo == id) {
			res.status(400).send('Can not transfer from account to itself');
		}
		else if(req.body.amount<=0) {
			res.status(400).send('Requested transfer amount is not >0');
		}
		else {
			if(req.body.amount>Account.getBalance(id)) {
				res.status(400).send('Requested transfer amount is higher then the balance.');
			}		
			else {
				Account.send(id,idTo,req.body.amount);
				res.status(200).send(Account.getRepresentation(id));
			}
		}
	}
});
/**

 * Get audit of an acount with given id
 */
router.get('/:id/audit',function(req,res) {
	if(typeof req.params.id == 'undefined' || req.params.id==null){
		res.status(400).send('You forgot to give a request id.');
	}
	else {
		var id = req.params.id;
		if(! Account.exists(id)) {
			res.status(400).send('Requesting none existing id '+id);
		}
		else {
			res.status(200).send(Account.getAudit(id));
		}
	}
});

module.exports = router;