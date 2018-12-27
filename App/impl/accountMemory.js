/**
 * This is an implementation of the account interface that uses the internal memory for
 * keeping state.
 */
var Account = require('./../models/account.js');
var ini = require('./../ini.js');
//Open file reader
var fs = require('fs');

//Load the mapping of Ids to keep track of what IDs are free
var mapOfIds = [];
var accountState;

fs.readFile(ini.data, function(err,data) {
	if (err) {
		throw err
	}
	accountState = JSON.parse(data);
	for(e in accountState) {
		mapOfIds[accountState.id]=1;
	}
});

/**
 * Generate a unique id in the range [10000...99999]
 */
function getNewId(){
	var newId = 10000 +Math.round(Math.random()*89999)+'';
	while(newId in mapOfIds) {
		newId = 10000 +Math.round(Math.random()*89999)+'';
	}
	//Mark that we are using this
	mapOfIds[newId]=1;
	return newId;
};

Account = function(name) {
	this.name = name;
	this.id = getNewId();
	this.balance = 0;
	this.audits = [];
	accountState[this.id]=(this);
	fs.writeFileSync(ini.data,JSON.stringify(accountState));
	return {'name':this.name,'id':this.id,'balance':this.balance};
}
Account.constructor = Account;

Account.getName = function(id) {
	return accountState[id].name;
};

Account.getId = function(id) {
	return accountState[id].id;
};

Account.getBalance = function(id) {
	return accountState[id].balance;
};

Account.addAuditEntry = function(id,debit,credit,description) {
	var ac = accountState[id];
	var audit = {
		'sequence': ac.audits.length+1,
		'credit': credit,
		'debit': debit,
		'description': description
	}
	ac.audits.push(audit);
	fs.writeFileSync(ini.data,JSON.stringify(accountState));
}

Account.getRepresentation = function(id) {
	var ac = accountState[id];
	return {'name':ac.name,'id':ac.id,'balance':ac.balance};
};

Account.deposit = function(id,amount) {
	if(amount>0) {
		accountState[id].balance+=amount;
		Account.addAuditEntry(id,0,amount,'deposit');
		fs.writeFileSync(ini.data,JSON.stringify(accountState));
		return this;
	}
	return new Error('Can not deposit ammount<=0');
};

Account.withdraw = function(id,amount) {
	if(amount>0) {
		accountState[id].balance-=amount;
		Account.addAuditEntry(id,amount,0,'withdraw');
		fs.writeFileSync(ini.data,JSON.stringify(accountState));
		return this;
	}
	return new Error('Can not deposit ammount<=0');
};

Account.getAudit = function(id) {
	return accountState[id].audits.reverse();
};

Account.send = function(id1, id2, amount) {
	if(amount>0) {
		accountState[id1].balance-=amount;
		Account.addAuditEntry(id1,amount,0,'send to #'+id2);
		accountState[id2].balance+=amount;
		Account.addAuditEntry(id2,0,amount,'receive from #'+id1);
		fs.writeFileSync(ini.data,JSON.stringify(accountState));
		return Account.getRepresentation(id1);
	}
	return new Error('Can not deposit ammount<=0');
};

Account.get = function(id) {
	return accountState[id];
};

Account.exists = function(id) {
	if(id==null || typeof id == 'undefined' || typeof mapOfIds[id] == 'undefined' || mapOfIds[id]==null) {
		return false;
	}
	return true;
};

module.exports = Account;