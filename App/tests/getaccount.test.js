var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

var th = require('./testhelpers.js');
//Expose testhelper methods, since they are anonymous
postJSON = th.postJSON;
getJSON = th.getJSON;
expectError = th.expectError;
expectNoError = th.expectNoError;
initializeState = th.initializeState;
verifyEntryResponse = th.verifyEntryResponse;
getEntries = th.getEntries;

/**
 * Test set for retreiving created accounts through GET
 */
describe('GET /account/:id', function() {
	beforeEach(function(done) {
		initializeState([{'name':'Pim Probeer'},{'name':'Tim Trial'},{'name':'Inge Inspectie'}],done);
	});
	describe('should give an error',function() {
		it('if id is null', function(done) {
			getJSON('/account/').end(function(err,res) {
				expectError(err,res);
				done();
			});			
		});
		it('if id is not a number', function(done) {
			getJSON('/account/id').end(function(err,res) {
				expectError(err,res);
				done();
			});		
		});
		it('if id is not defined', function(done) {
			getJSON('/account/10').end(function(err,res) {
				expectError(err,res);
				done();
			});		
		});	
	});
	it('Should return a correct entry for a given id', function(done) {
			getJSON('/account/'+getEntries()[0].id).end(function(err,res) {
				expectNoError(err,res);
				verifyEntryResponse(res.body,getEntries()[0]);
				done();
			});		
	});	
	it('Should consitently deliver the correct content for two chained GETs', function(done) {
		var balance;
		getJSON('/account/'+getEntries()[1].id).end(function(err,res) {
			expectNoError(err,res);
			verifyEntryResponse(res.body,getEntries()[1]);
			
			getJSON('/account/'+getEntries()[1].id).end(function(err,res) {
				expectNoError(err,res);
				verifyEntryResponse(res.body,getEntries()[1]);
				done();	
			});
		});
	});		
});