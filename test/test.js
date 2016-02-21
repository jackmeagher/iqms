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
                        .get('/question')
                        .expect(200, done);
                });
            });
            it('should return success true and no data', function(done) {
                server_promise.then( (server) => {
                    request(server)
                        .get('/question')
                        .expect(200, {
                                success: true,
                                questions: []
                            },
                            done
                        );
                });
            });
        });

        /*describe('#POST', function() {
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
        });*/
    });
});

/*describe('/question', function() {
    describe('#POST', function() {
        it('should create a question without error', function(done) {
            var req = {
                body : {
                    question_text: "Test Question 1",
                    difficulty: 1
                }
            };
            var res =
            user.save(function(err) {
                if (err) throw err;
                done();
            });
        });
        it('should error on bad data', function(done) {
            var user = new User(null, '', 123);
            user.save(function(err) {
                if (!err) throw new Error("No error!");
                done();
            });
        });
    });

});*/
