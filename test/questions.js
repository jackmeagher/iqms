require('use-strict');
"use strict";
var request = require('supertest');
var server_promise = require('../bin/www_test');

var expectedQuestionData = {
    'difficulty': 5,
    'question_text' : 'How does the JVM handle tail-end recursion?'
};

describe('App', function () {
    before(function () {
        server_promise = require('../bin/www_test');
    });
    describe('/question', function () {
        var url = '/question';
        describe('#GET /question ', function () {

            it('should return content as type json', function (done) {
                server_promise.then((server) => {
                    request(server)
                        .get(url)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200, done);
                });
            });
            it('should have a property questions', function (done) {
                server_promise.then((server) => {
                    request(server)
                        .get(url)
                        .expect(function(res) {
                            if (!res.body || !res.body.questions) {
                                throw new Error("No questions field returned.");
                            }
                        })
                        .end(function (err, res) {
                            if (err) {
                                done(err);
                            } else {
                                done();
                            }
                        });
                });
            });

        });

        describe('#POST', function () {
            it('should add a question', function (done) {
                server_promise.then((server) => {
                    var payload = expectedQuestionData;

                    request(server)
                        .post(url)
                        .send(payload)
                        .expect(function (res) {
                            if (!res.body.question.difficulty == payload.difficulty) {
                                throw new Error("Didn't get expected difficulty back.");
                            }
                            if (!res.body.question.question_text == payload.question_text) {
                                throw new Error("Didn't get expected question_text back.")
                            }
                            expectedQuestionData.id= res.body.question.id;
                        })
                        .end(function (err, res) {
                            if (err) {
                                done(err);
                            } else {
                                done();
                            }
                        });
                });
            });
        });

        //add more tests below
        //end tests
    });
});
