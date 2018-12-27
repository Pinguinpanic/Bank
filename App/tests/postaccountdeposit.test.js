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
 * Test set for depositing to accounts
 */
describe('POST /account/:id/deposit', function() {
	beforeEach(function(done) {
		initializeState([{'name':'Pim Probeer'},{'name':'Tim Trial'},{'name':'Inge Inspectie'}],done);
	});
	describe('should give an error',function() {
		it('if id is null', function(done) {
			postJSON('/account//deposit',{amount:10}).end(function(err,res) {
				expectError(err,res);
				done();		
			});
		});
		it('if id is not a number', function(done) {
			postJSON('/account/bleb/deposit',{amount:100}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});
		it('if id is not defined', function(done) {
			postJSON('/account/10/deposit',{amount:1000}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});	
		it('if amount to deposit is 0', function(done) {
			postJSON('/account/'+getEntries()[0].id+'/deposit',{amount:0}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});	
		it('if amount to deposit is negative', function(done) {
			postJSON('/account/'+getEntries()[1].id+'/deposit',{amount:-10}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});	
		it('if amount to deposit is not given', function(done) {
			postJSON('/account/'+getEntries()[2].id+'/deposit',{}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});			
	});
	it("should increase balance by the given amount by depositing", function(done) {
		postJSON('/account/'+getEntries()[0].id+'/deposit',{'amount':100}).end(function(err,res){
			expectNoError(err,res);
			expect(res.body.balance).to.be.equal(100);
			done();
		});
	})
	it("should increase balance by the given amount for sequential depositing", function(done) {
		postJSON('/account/'+getEntries()[1].id+'/deposit',{'amount':150}).end(function(err,res){
			expectNoError(err,res);
			expect(res.body.balance).to.be.equal(150);
			postJSON('/account/'+getEntries()[1].id+'/deposit',{'amount':80}).end(function(err,res){
				expectNoError(err,res);
				expect(res.body.balance).to.be.equal(230);
				done();
			});
		});
	})	
});
