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
 * Test set for withdrawing from accounts
 */
describe('POST /account/:id/withdraw', function() {
	beforeEach(function(done) {
		initializeState([{'name':'Teun Test','balance':113},{'name':'Karel Keur','balance':7}],done);
	});
	describe('should give an error',function() {
		it('if id is null', function(done) {
			postJSON('/account//withdraw',{amount:10}).end(function(err,res) {
				expectError(err,res);
				done();		
			});
		});
		it('if id is not a number', function(done) {
			postJSON('/account/id/withdraw',{amount:100}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});
		it('if id is not defined', function(done) {
			postJSON('/account/10/withdraw',{amount:1000}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});	
		it('if amount to withdraw is 0', function(done) {
			postJSON('/account/'+getEntries()[0].id+'/withdraw',{amount:0}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});	
		it('if amount to withdraw is negative', function(done) {
			postJSON('/account/'+getEntries()[1].id+'/withdraw',{amount:-10}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});	
		it('if amount to withdraw is not given', function(done) {
			postJSON('/account/'+getEntries()[0].id+'/withdraw',{}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});		
		it('if amount to withdraw is greater then the current balance', function(done) {
			postJSON('/account/'+getEntries()[1].id+'/withdraw',{amount:600}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});			
	});
	it("should decrease balance by the given amount by withdrawing", function(done) {
		postJSON('/account/'+getEntries()[0].id+'/withdraw',{'amount':50}).end(function(err,res){
			expectNoError(err,res);
			expect(res.body.balance).to.be.equal(getEntries()[0].balance-50);
			done();
		});
	})
	it("should decrease balance by the given amount for sequential withdrawing", function(done) {
		postJSON('/account/'+getEntries()[1].id+'/withdraw',{'amount':4}).end(function(err,res){
			expectNoError(err,res);
			expect(res.body.balance).to.be.equal(getEntries()[1].balance-4);
			postJSON('/account/'+getEntries()[1].id+'/withdraw',{'amount':2}).end(function(err,res){
				expectNoError(err,res);
				expect(res.body.balance).to.be.equal(getEntries()[1].balance-4-2);
				done();
			});
		});
	})	
});
