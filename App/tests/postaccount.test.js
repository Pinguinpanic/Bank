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
 * Test set for creating a new account through POST
 */
describe('POST account', function() {
	describe('should give an error', function() {
		it('if input is omitted', function(done) {
			postJSON('/account',{}).end(function(err,res) {
				expectError(err,res);
				done();
			});
		});
		it('if input is null', function(done) {
			postJSON('/account',{'name': null}).end(function(err,res) {
				expectError(err,res);
				done();
			});
		});	
		it('if input is an empty string', function(done) {
			postJSON('/account',{'name': ''}).end(function(err,res) {
				expectError(err,res);
				done();
			});		
		});			
	});	
	describe('should create an account with', function() {
		it('a balance of 0', function(done) {
			postJSON('/account',{'name':'Timo Test'}).end(function(err,res) {
				expectNoError(err,res);
				
				expect(res.body).to.include({'balance':0});
				done();
			});
		});
		it('a name equal to the input', function(done) {
			var checkName = 'Pieter Probeer'
			postJSON('/account',{'name':checkName}).end(function(err,res) {
				expectNoError(err,res);
				
				expect(res.body).to.include({'name':checkName});
				done();
			});
		});
		it('a complete set of inputs', function(done) {
			var checkName = ' Karel Keur'
			postJSON('/account',{'name':checkName}).end(function(err,res) {
				expectNoError(err,res);
				
				expect(res.body).to.include({'name':checkName});
				expect(res.body).to.include({'balance':0});
				expect(res.body).to.ownPropertyDescriptor('id');
				done();
			});
		});		
	});
	describe('should create unique ids', function() {
		it('for 2 same names', function(done) {
			var sameName='Teun Toets';
			postJSON('/account',{'name':sameName}).end(function(err,res){
				expectNoError(err,res);
				
				//We're abusing javascript callbacks for timing. Kids don't do javascript.
				var prevId=res.body.id;
				postJSON('/account',{'name':sameName}).end(function(err,res){
					expectNoError(err,res);
					
					expect(res.body.id).to.not.be.equal(prevId);
					done();
				});
			});
		});
		it('for 2 different names', function(done) {
			postJSON('/account',{'name':'Chad Check'}).end(function(err,res){
				expectNoError(err,res);
				
				//Again abusing javascript callbacks for timing. Before you know it you're hooked.
				var prevId=res.body.id;
				postJSON('/account',{'name':'Mieke Meet'}).end(function(err,res){
					expectNoError(err,res);
					
					expect(res.body.id).to.not.be.equal(prevId);
					done();
				});
			});
		});		
	})
});
