/**
 * This interface described how Account should be implemented.
 */

Account = function(name) {
	//Initialize an account with given name, return it.
}
Account.constructor = Account;

Account.getName = function(id) {
	//Return name of given account.
};

Account.getId = function(id) {
	//Return id of given account
};

Account.getBalance = function(id) {
	//Return balance of given account
};

Account.getRepresentation = function(id) {
	//Get a representation of given account with id, name and balance
};

Account.deposit = function(id,amount) {
	//Deposit amount, return account.
};

Account.withdraw = function(id,amount) {
	//Withdraw amount, return account.
};

Account.getAudit = function(id) {
	//Return an audit of this account
};

Account.send = function(account1, account2, amount) {
	//Static, sent ammount from account1 to account 2
};


Account.exists = function(id) {
	//Static, returns if given id exists
};

module.exports = Account;