require('use-strict');
"use strict";
var request = require('supertest');
var server_promise = require('../bin/www_test');

var expectedUsersData = {
'username' : 'testman username',
'first_name' : 'testman first',
'last_name' : 'testman last'
};

describe('App', function() {
    before( function() {
        server_promise = require('../bin/www_test');
    });
    describe('/user', function() {
        var url = '/user';
        describe('#GET /user ', function() {

            it('should return content as type json', function(done) {
                server_promise.then( (server) => {
                    request(server)
                        .get(url)
                        .expect('Content-Type', /json/)
                        .expect(200, done)
                        .end(function (err, res) {
                          if (err) return done(err);
                        });
                        done();
                });
            });
            it('should have a property (id)', function(done) {
                server_promise.then( (server) => {
                    request(server)
                        .get(url)
                        .expect(200, done)
                        .end(function (err, res) {
                          res.body[0].should.have.property('id');
                          done();
                        });
                        done();
                });
            });
            it('should return expected users', function(done) {
                server_promise.then( (server) => {
                    request(server)
                        .get(url)
                        .expect(200)
                        .end(function (err, res) {
                          //TODO: Define test data and adjust
                          var expectedUsers = ['add', 'test', 'data'];


                          error(err, 'No error');
                          same(res.body, expectedUsers, 'Users as expected');
                          end();
                        });
                        done();
                });
            });
        });

        describe('#POST', function() {
            it('should add a user', function(done) {
                server_promise.then( (server) => {
                    var payload = expectedUsersData;

                    request(server)
                        .post(url)
                        .send(payload)
                        .expect('Content-Type', /json/)
                        .expect(function(res) {
                          if (!res.body == payload) throw new error("Didn't get expected data back")
                        })
                        .end(function (err, res) {
                            if (err) return done(err);
                          done();
                        });
                });
            });
        });


    });
});
