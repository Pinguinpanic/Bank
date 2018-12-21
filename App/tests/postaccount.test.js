var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

var appUrl = 'http://localhost:3000'

describe('POST account', function() {
	var request;
	beforeEach(function() {
		request = chai.request(appUrl).put('/account');
	});
	describe('should give an error', function() {
		it('if input is omitted', function() {
			request.send({}).end(function(err,res) {
				expect(err);
			});
		});
		it('if input is null', function() {
			request.send({"name": null}).end(function(err,res) {
				expect(err);
			});
		});	
		it('if input is an empty string', function() {
			request.send({"name": ""}).end(function(err,res) {
				expect(err);
			});			
		});			
	});	
});