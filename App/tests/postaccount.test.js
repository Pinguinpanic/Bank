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
				expect(err).to.not.be.empty;
				done();
			});
		});
		it('if input is null', function(done) {
			request.send({'name': null}).end(function(err,res) {
				expect(err).to.not.be.empty;
				done();
			});
		});	
		it('if input is an empty string', function(done) {
			request.send({'name': ''}).end(function(err,res) {
				expect(err).to.not.be.empty;
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
				expect(res).to.not.be.empty;
				expect(res.body).to.include({'balance':0});
				done();
			});
		});
	});
});