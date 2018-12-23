var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

var appUrl = 'http://localhost:3000'

/**
 * Test set for creating a new account through POST
 */
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

/**
 * Test set for retreiving created accounts through GET
 */
describe('GET /account/:id', function() {
	var request;
	var testEntries =[{'name':'Pim Probeer'},{'name':'Tim Trial'},{'name':'Inge Inspectie'}]
	before(function(done) {
		//Create a nice initial state
		chai.request(appUrl).post('/account').send(testEntries[0]).end(function(err,res) {
			testEntries[0].id=res.body.id;
			chai.request(appUrl).post('/account').send(testEntries[1]).end(function(err,res) {
				testEntries[1].id=res.body.id;
				chai.request(appUrl).post('/account').send(testEntries[2]).end(function(err,res) {
					testEntries[2].id=res.body.id;
					request = chai.request(appUrl);
					done();
				})
			})
		})
	});
	describe('should give an error',function() {
		it('if id is null', function(done) {
			request.get('/account/').send({}).end(function(err,res) {
				expect(res).to.not.be.empty;
				expect(res.status).to.not.be.equal(200);
				done();		
			});
		});
		it('if id is not a number', function(done) {
			request.get('/account/id').send({}).end(function(err,res) {
				expect(res).to.not.be.empty;
				expect(res.status).to.not.be.equal(200);
				done();	
			});
		});
		it('if id is not defined', function(done) {
			request.get('/account/10').send({}).end(function(err,res) {
				expect(res).to.not.be.empty;
				expect(res.status).to.not.be.equal(200);
				done();	
			});
		});	
	});
	it('Should return a correct entry for a given id', function(done) {
		request.get('/account/'+testEntries[0].id).send({}).end(function(err,res) {
			expect(res).to.not.be.empty;
			expect(res.status).to.be.equal(200);
			expect(res.body.name).to.be.equal(testEntries[0].name);
			expect(res.body.id).to.be.equal(testEntries[0].id);
			expect(res.body.balance).to.not.be.null;
			done();		
		});
	});	
	it('Should consitently deliver the correct content for two chained GETs', function(done) {
		var balance;
		request.get('/account/'+testEntries[1].id).send({}).end(function(err,res) {
			expect(res).to.not.be.empty;
			expect(res.status).to.be.equal(200);
			expect(res.body.name).to.be.equal(testEntries[1].name);
			expect(res.body.id).to.be.equal(testEntries[1].id);
			var balance = res.body.balance
			chai.request(appUrl).get('/account/'+testEntries[1].id).send({}).end(function(err,res) {
				expect(res).to.not.be.empty;
				expect(res.status).to.be.equal(200);
				expect(res.body.name).to.be.equal(testEntries[1].name);
				expect(res.body.id).to.be.equal(testEntries[1].id);
				expect(res.body.balance).to.be.equal(balance);
				done();	
			});
		});
	});		
});

/**
 * Test set for depositing to accounts
 */
describe('POST /account/:id/deposit', function() {
	var request;
	var testEntries =[{'name':'Pim Probeer'},{'name':'Tim Trial'},{'name':'Inge Inspectie'}]
	before(function(done) {
		//Create a nice initial state
		chai.request(appUrl).post('/account').send(testEntries[0]).end(function(err,res) {
			testEntries[0].id=res.body.id;
			chai.request(appUrl).post('/account').send(testEntries[1]).end(function(err,res) {
				testEntries[1].id=res.body.id;
				chai.request(appUrl).post('/account').send(testEntries[2]).end(function(err,res) {
					testEntries[2].id=res.body.id;
					request = chai.request(appUrl);
					done();
				})
			})
		})
	});
	describe('should give an error',function() {
		it('if id is null', function(done) {
			request.post('/account//deposit').send({amount:10}).end(function(err,res) {
				expect(res).to.not.be.empty;
				expect(res.status).to.not.be.equal(200);
				done();		
			});
		});
		it('if id is not a number', function(done) {
			request.post('/account/id/deposit').send({amount:100}).end(function(err,res) {
				expect(res).to.not.be.empty;
				expect(res.status).to.not.be.equal(200);
				done();	
			});
		});
		it('if id is not defined', function(done) {
			request.post('/account/10/deposit').send({amount:1000}).end(function(err,res) {
				expect(res).to.not.be.empty;
				expect(res.status).to.not.be.equal(200);
				done();	
			});
		});	
		it('if amount to deposit is 0', function(done) {
			request.post('/account/'+testEntries[0].id+'/deposit').send({amount:0}).end(function(err,res) {
				expect(res).to.not.be.empty;
				expect(res.status).to.not.be.equal(200);
				done();	
			});
		});	
		it('if amount to deposit is negative', function(done) {
			request.post('/account/'+testEntries[1].id+'/deposit').send({amount:-10}).end(function(err,res) {
				expect(res).to.not.be.empty;
				expect(res.status).to.not.be.equal(200);
				done();	
			});
		});	
		it('if amount to deposit is not given', function(done) {
			request.post('/account/'+testEntries[2].id+'/deposit').send({}).end(function(err,res) {
				expect(res).to.not.be.empty;
				expect(res.status).to.not.be.equal(200);
				done();	
			});
		});			
	});
	it("should increase balance by the given amount by depositing", function(done) {
		request.post('/account/'+testEntries[0].id+'/deposit').send({'amount':100}).end(function(err,res){
			expect(res.body.balance).to.be.equal(100);
			done();
		});
	})
	it("should increase balance by the given amount for sequential depositing", function(done) {
		request.post('/account/'+testEntries[1].id+'/deposit').send({'amount':150}).end(function(err,res){
			expect(res.body.balance).to.be.equal(150);
			chai.request(appUrl).post('/account/'+testEntries[1].id+'/deposit').send({'amount':80}).end(function(err,res){
				expect(res.body.balance).to.be.equal(230);
				done();
			});
		});
	})	
});
