require('use-strict');
"use strict";
var request = require('supertest');
var server_promise = require('../bin/www');

describe('App', function() {
    before( function() {
        server_promise = require('../bin/www');
    });
    describe('/question', function() {
        var url = '/question';
        describe('#GET', function() {

            it('should return response code 200', function(done) {
                server_promise.then( (server) => {
                    request(server)
                        .get(url)
                        .expect(200, done);
                });
            });
            it('should return success true and no data', function(done) {
                server_promise.then( (server) => {
                    request(server)
                        .get(url)
                        .expect(200, {
                                success: true,
                                questions: []
                            },
                            done
                        );
                });
            });
        });

        describe('#POST', function() {
            it('should insert a question', function(done) {
                server_promise.then( (server) => {
                    var payload = {
                        'title' : 'Test Question #1',
                        'difficulty' : 1
                    };
                    request(server)
                        .post(url)
                        .send(payload)
                        .expect(200, payload, done);
                });
            });
        });
    });

    //begin interview tests
    describe('/interview', function() {
        var url = '/interview';
        describe('#GET', function() {

            it('should return response code 200', function(done) {
                server_promise.then( (server) => {
                    request(server)
                        .get(url)
                        .expect(200, done);
                });
            });
            it('should return success true and no data', function(done) {
                server_promise.then( (server) => {
                    request(server)
                        .get(url)
                        .expect(200, {
                                success: true,
                                interviews: []
                            },
                            done
                        );
                });
            });
        });

        describe('#POST', function() {
            it('should create an interview', function(done) {
                server_promise.then( (server) => {
                    var payload = {
                        /*
                          not sure what should go here
                          since routes/interview.js
                          create({}) is not
                          fleshed out with data values
                        */
                    };
                    request(server)
                        .post(url)
                        .send(payload)
                        .expect(function(payload){
                          //include function that expects payload
                          if(payload.body.interview == created.dataValues){
                            return;
                          }
                        })
                        .end(done);
                });
            });
        });

        describe('#ID', function() {
            it('should return interview by id', function(done) {
                server_promise.then( (server) => {
                    var payload = {
                        /*
                          add id for interviews[0] from get all
                        */
                        'id' : interviews[0]
                    };
                    request(server)
                        .post(url)
                        .send(payload)
                        .expect(200,payload,done);
                });
            });
        });

        describe('#DELETE', function() {
            it('should delete an interview by id', function(done) {
                server_promise.then( (server) => {
                    var payload = {
                        /*
                          add id from in previous test to delete
                        */
                        'id' : interviews[0]
                    };
                    request(server)
                        .post(url)
                        .send(payload)
                        .expect(200, {
                          answer : destroyed.dataValues
                        }, done);
                });
            });
        });

    });
});
