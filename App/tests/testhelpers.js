var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

var appUrl = 'http://localhost:3000'
var testEntries = [];

/**
 * Do a post to our application for endpoint call with given body.
 */
function postJSON(call, body) {
	if(typeof body == 'undefined' || body==null) {
		body={};
	}
	var request = chai.request(appUrl).post(call).send(body);
	return request;
}

/**
 * Do a post to our application for endpoint call with given body.
 */
function getJSON(call, body) {
	if(typeof body == 'undefined' || body==null) {
		body={};
	}
	var request = chai.request(appUrl).get(call).send(body);
	return request;
}

/**
 * Expect the state res,err to have thrown an error
 */
function expectError(err,res) {
	expect(res).to.not.be.empty;
	expect(res.status).to.not.be.equal(200);
}

/**
 * Expect the state res,err to not have thrown an error
 */
function expectNoError(err,res) {
	expect(err).to.be.null;
	expect(res).to.not.be.empty;
	expect(res.status).to.be.equal(200);
}

/**
 * Initialize the state of global variable testEntires to be equal to entries, with given balance and name.
 * id's are filled in for each after creation. Done is called when the initialization is done. Leave state empty.
 */
function initializeState(entries,done,state) {
	if(typeof state == 'undefined') {
		state = 0;
	}
	if(state<entries.length) {
		var e = entries[state];
		var request = postJSON('/account',{'name':e.name});
		request.end(function(err,res){
			expectNoError(err,res);
			e.id = res.body.id;
			if(typeof e.balance!=='undefined' && e.balance>0) {
				request = postJSON('/account/'+e.id+'/deposit',{'amount':e.balance});
				request.end(function(err,res) {
					expectNoError(err,res);
					initializeState(entries,done,state+1)
				})
			}
			else {
				initializeState(entries,done,state+1);
			}
		});
	}
	else {
		//Expose entries state to global.
		testEntries = entries;
		done();
	}
}

/**
 * Verify the object given as body to have given properties id, name and balance. If one of them
 * is not given, it is not checked for value, but still expected to not be empty.
 */
function verifyResponse(body, id, name, balance) {
	expect(body.id).to.not.be.null;
	if(typeof id !== 'undefined' && id!=null) {
		expect(body.id).to.be.equal(id);
	}
	expect(body.name).to.not.be.null;
	if(typeof name !== 'undefined' && name!=null) {
		expect(body.name).to.be.equal(name);
	}
	expect(body.balance).to.not.be.null;
	if(typeof balance !== 'undefined' && balance!=null) {
		expect(body.balance).to.be.equal(balance);
	}
}

/**
 * Verify the given response corresponds the given test entry. Id, name and balance.
 */
function verifyEntryResponse(body, entry) {
	verifyResponse(body,entry.id,entry.name,entry.balance);
}

/**
 * A method for exposing our internal testEntries.
 */
function getEntries() {
	return testEntries;
}

module.exports = {
	postJSON,
	getJSON,
	expectError,
	expectNoError,
	initializeState,
	verifyResponse,
	verifyEntryResponse,
	getEntries
}