var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

var appUrl = 'http://localhost:3000'

describe('POST account', function() {
	var request;
	beforeEach(function() {
		request = chai.request(appUrl).post('/account');
	});
	describe('should give an error', function() {
		it('if input is omitted', function(done) {
			request.send({}).end(function(err,res) {
				expect(res).to.not.be.empty;
				expect(res.status).to.not.be.equal(200);
				done();
			});
		});
		it('if input is null', function(done) {
			request.send({'name': null}).end(function(err,res) {
				expect(res).to.not.be.empty;
				expect(res.status).to.not.be.equal(200);
				done();
			});
		});	
		it('if input is an empty string', function(done) {
			request.send({'name': ''}).end(function(err,res) {
				expect(res).to.not.be.empty;
				expect(res.status).to.not.be.equal(200);
				done();
			});			
		});			
	});	
	describe('should create an account with', function() {
		var request;
		beforeEach(function() {
			request = chai.request(appUrl).post('/account');
		});
		it('a balance of 0', function(done) {
			request.send({'name':'Timo Test'}).end(function(err,res) {
				expect(err).to.be.null;
				expect(res.status).to.be.equal(200);
				expect(res).to.not.be.empty;
				expect(res.body).to.include({'balance':0});
				done();
			});
		});
		it('a name equal to the input', function(done) {
			var checkName = 'Pieter Probeer'
			request.send({'name':checkName}).end(function(err,res) {
				expect(err).to.be.null;
				expect(res.status).to.be.equal(200);				
				expect(res).to.not.be.empty;
				expect(res.body).to.include({'name':checkName});
				done();
			});
		});
		it('a complete set of inputs', function(done) {
			var checkName = ' Karel Keur'
			request.send({'name':checkName}).end(function(err,res) {
				expect(err).to.be.null;
				expect(res.status).to.be.equal(200);				
				expect(res).to.not.be.empty;
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
			chai.request(appUrl).post('/account').send({'name':sameName}).end(function(err,res){
				expect(err).to.be.null;
				expect(res.status).to.be.equal(200);				
				expect(res).to.not.be.empty;
				//This is a bit weird but we're abusing javascript callbacks for timing
				var prevId=res.body.id;
				chai.request(appUrl).post('/account').send({'name':sameName}).end(function(err,res){
					expect(err).to.be.null;
					expect(res.status).to.be.equal(200);				
					expect(res).to.not.be.empty;
					expect(res.body.id).to.not.be.equal(prevId);
					done();
				});
			});
		});
		it('for 2 different names', function(done) {
			chai.request(appUrl).post('/account').send({'name':'Chad Check'}).end(function(err,res){
				expect(err).to.be.null;
				expect(res.status).to.be.equal(200);				
				expect(res).to.not.be.empty;
				//This is a bit weird but we're abusing javascript callbacks for timing
				var prevId=res.body.id;
				chai.request(appUrl).post('/account').send({'name':'Mieke Meet'}).end(function(err,res){
					expect(err).to.be.null;
					expect(res.status).to.be.equal(200);					
					expect(res).to.not.be.empty;
					expect(res.body.id).to.not.be.equal(prevId);
					done();
				});
			});
		});		
	})
});