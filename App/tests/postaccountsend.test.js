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
 * Test set for sending from account to account
 */
describe('POST /account/:id/send', function() {
	
	beforeEach(function(done) {
		initializeState([{'name':'Timo Test','balance':100},{'name':'Pietje Probeer','balance':40}],done);
	});
	describe('should give an error',function() {
		it('if id is null', function(done) {
			postJSON('/account//send',{amount:10, receiverid:getEntries()[0].id}).end(function(err,res) {
				expectError(err,res);
				done();		
			});
		});
		it('if id is not a number', function(done) {
			postJSON('/account/id/send',{amount:100, receiverid:getEntries()[0].id}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});
		it('if id is not defined', function(done) {
			postJSON('/account/10/send',{amount:1000, receiverid:getEntries()[0].id}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});	
		it('if amount to send is 0', function(done) {
			postJSON('/account/'+getEntries()[0].id+'/send',{amount:0, receiverid:getEntries()[1].id}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});	
		it('if amount to send is negative', function(done) {
			postJSON('/account/'+getEntries()[1].id+'/send',{amount:-10, receiverid:getEntries()[0].id}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});	
		it('if amount to send is not given', function(done) {
			postJSON('/account/'+getEntries()[0].id+'/send',{receiverid:getEntries()[1].id}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});		
		it('if amount to send is greater then the current balance', function(done) {
			postJSON('/account/'+getEntries()[1].id+'/send',{amount:600, receiverid:getEntries()[0].id}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});	
	it('if sender id is same as receiver id', function(done) {
			postJSON('/account/'+getEntries()[0].id+'/send',{amount:10, receiverid:getEntries()[0].id}).end(function(err,res) {
				expectError(err,res);
				done();	
			});
		});		
	});
	it("should decrease balance from sender", function(done) {
		postJSON('/account/'+getEntries()[0].id+'/send',{amount:50, receiverid:getEntries()[1].id}).end(function(err,res){
			expectNoError(err,res);
			expect(res.body.balance).to.be.equal(getEntries()[0].balance-50);
			done();
		});
	})
	it("should increase balance from receiver", function(done) {
		postJSON('/account/'+getEntries()[0].id+'/send',{amount:50, receiverid:getEntries()[1].id}).end(function(err,res){
			expectNoError(err,res);
			getJSON('/account/'+getEntries()[1].id).end(function(err,res){
				expectNoError(err,res);
				expect(res.body.balance).to.be.equal(getEntries()[1].balance+50);
				done();
			});
		});
	})	
	
	it("should increase and decreance balance by the given amount for sequential sending", function(done) {
		postJSON('/account/'+getEntries()[1].id+'/send',{'amount':10, receiverid:getEntries()[0].id}).end(function(err,res){
			expectNoError(err,res);
			expect(res.body.balance).to.be.equal(getEntries()[1].balance-10);
			postJSON('/account/'+getEntries()[1].id+'/send',{'amount':20, receiverid:getEntries()[0].id}).end(function(err,res){
				expectNoError(err,res);
				expect(res.body.balance).to.be.equal(getEntries()[1].balance-10-20);
				getJSON('/account/'+getEntries()[0].id).send({}).end(function(err,res){
					expectNoError(err,res);
					expect(res.body.balance).to.be.equal(getEntries()[0].balance+10+20);
					done();
				});
			});
		});
	})	
});
