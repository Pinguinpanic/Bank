/**
 * This interface described how Account should be implemented.
 */

Account = function(name) {
	//Initialize an account with given name, return it.
}
Account.constructor = Account;

Account.prototype.getName = function() {
	//Return name of this account.
};

Account.prototype.getId = function() {
	//Return id of this account
};

Account.prototype.getBalance = function() {
	//Return balance of this account
};

Account.prototype.getRepresentation = function() {
	//Get a representation of this account with id, name and balance
};

Account.prototype.deposit = function(amount) {
	//Deposit amount, return account.
};

Account.prototype.withdraw = function(amount) {
	//Withdraw amount, return account.
};

Account.prototype.getAudit = function() {
	//Return an audit of this account
};

Account.send = function(account1, account2, amount) {
	//Static, sent ammount from account1 to account 2
};

module.exports = Account;