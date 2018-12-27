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
describe('GET /account/:id/audit', function() {
	beforeEach(function(done) {
		initializeState([{'name':'Timo Test'},{'name':'Pietje Probeer'}],done);
	});
	describe('should give an error',function() {
		it('if id is null', function(done) {
			getJSON('/account//audit').end(function(err,res) {
				expectError(err,res);
				done();
			});			
		});
		it('if id is not a number', function(done) {
			getJSON('/account/id/audit').end(function(err,res) {
				expectError(err,res);
				done();
			});		
		});
		it('if id is not defined', function(done) {
			getJSON('/account/10/audit').end(function(err,res) {
				expectError(err,res);
				done();
			});		
		});	
	});
	it('Should return an empty entry for a clean account', function(done) {
			getJSON('/account/'+getEntries()[0].id+'/audit').end(function(err,res) {
				expectNoError(err,res);

				expect(res.body).to.be.equal({});
				done();
			});		
	});	
	it('Should show a deposit correctly', function(done) {
		var balance;
		postJSON('/account/'+getEntries()[0].id+'/deposit',{amount:100}).end(function(err,res) {
			expectNoError(err,res);
			
			getJSON('/account/'+getEntries()[0].id+'/audit').end(function(err,res) {
				expectNoError(err,res);
				expect(res.body).not.be.empty;
				expect(res.body[0]).not.be.empty;
				expect(res.body[0].sequence).to.be.equal(1);
				expect(res.body[0].credit).to.be.equal(100);
				expect(res.body[0].description).to.be.equal('deposit');
				done();	
			});
		});
	});	
	it('Should show a deposit and sequential withdrawal correctly', function(done) {
		var balance;
		postJSON('/account/'+getEntries()[1].id+'/deposit',{amount:100}).end(function(err,res) {
			expectNoError(err,res);
			postJSON('/account/'+getEntries()[1].id+'/withdraw',{amount:50}).end(function(err,res) {
				expectNoError(err,res);
				getJSON('/account/'+getEntries()[1].id+'/audit').end(function(err,res) {
					expectNoError(err,res);
					expect(res.body).not.be.empty;
					//Check if the withdrawal is correct and listed first
					expect(res.body[0]).not.be.empty;
					expect(res.body[0].sequence).to.be.equal(2);
					expect(res.body[0].debit).to.be.equal(50);
					expect(res.body[0].description).to.be.equal('withdraw');
					//Check if the deposit is correct and listed second
					expect(res.body[1]).not.be.empty;
					expect(res.body[1].sequence).to.be.equal(1);
					expect(res.body[1].credit).to.be.equal(100);
					expect(res.body[1].description).to.be.equal('deposit');
					done();	
				});
			});
		});
	});	
	it('Should show a deposit followed by sending correctly for both sender and receiver.', function(done) {
		var balance;
		//Do the deposit
		postJSON('/account/'+getEntries()[0].id+'/deposit',{amount:80}).end(function(err,res) {
			expectNoError(err,res);
			//Send the money
			postJSON('/account/'+getEntries()[0].id+'/send',{'amount':30, receiverid:getEntries()[1].id}).end(function(err,res) {
				expectNoError(err,res);
				//Check Sender
				getJSON('/account/'+getEntries()[0].id+'/audit').end(function(err,res) {
					expectNoError(err,res);
					expect(res.body).not.be.empty;
					//Check if the sending is correct and listed first
					expect(res.body[0]).not.be.empty;
					expect(res.body[0].sequence).to.be.equal(2);
					expect(res.body[0].debit).to.be.equal(30);
					expect(res.body[0].description).to.be.equal('send to #'+getEntries()[1].id);
					//Check if the deposit is correct and listed second
					expect(res.body[1]).not.be.empty;
					expect(res.body[1].sequence).to.be.equal(1);
					expect(res.body[1].credit).to.be.equal(80);
					expect(res.body[1].description).to.be.equal('deposit');
					
					//Check receiver
					getJSON('/account/'+getEntries()[0].id+'/audit').end(function(err,res) {
						expectNoError(err,res);
						expect(res.body).not.be.empty;
						//Check if the sending is correct and listed first
						expect(res.body[0]).not.be.empty;
						expect(res.body[0].sequence).to.be.equal(1);
						expect(res.body[0].credit).to.be.equal(30);
						expect(res.body[0].description).to.be.equal('receive from #'+getEntries()[0].id);
					});
				})					
			});
		});
	});	
});