/**
 * This is an implementation of the account interface that uses the internal memory for
 * keeping state.
 */
var Account = require('./../models/account.js');

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

Account = function(name) {
	this.name = name;
	this.id = getNewId();
	this.balance = 0;
	return this;
}
Account.constructor = Account;

Account.prototype.getName = function() {
	return this.name;
};

Account.prototype.getId = function() {
	return this.id;
};

Account.prototype.getBalance = function() {
	return this.balance;
};

Account.prototype.deposit = function(amount) {
	if(amount>0) {
		this.balance+=amount;
		return this;
	}
	return new Error('Can not deposit ammount<=0');
};

Account.prototype.withdraw = function(amount) {
	if(amount>0) {
		this.balance-=amount;
		return this;
	}
	return new Error('Can not deposit ammount<=0');
};

Account.send = function(account1, account2, amount) {
	if(amount>0) {
		account1.balance-=amount;
		account2.balance+=amount;
		return this;
	}
	return new Error('Can not deposit ammount<=0');
};

module.exports = Account;