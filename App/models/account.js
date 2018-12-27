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

Account.prototype.deposit = function(amount) {
	//Deposit amount, return account.
};

Account.prototype.withdraw = function(amount) {
	//Withdraw amount, return account.
};

Account.send = function(account1, account2, amount) {
	//Static, sent ammount from account1 to account 2
};

module.exports = Account;