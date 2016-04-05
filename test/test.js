require('use-strict');
"use strict";
var request = require('supertest');
var server_promise = require('../bin/www_test');

describe('App', function() {
    before( function() {
        server_promise = require('../bin/www_test');
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
    });
});
