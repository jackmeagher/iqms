require('use-strict');
"use strict";
var request = require('supertest');
var server_promise = require('../bin/www_test');
var expectedAnswersData = {
  'answer_text': 'test_feedback',
  'rating': 'test,_rating',
  'interviewId' : 0,
  'questionId' : 0
};

describe('App', function () {
    before(function () {
        server_promise = require('../bin/www_test');
    });
    describe('/answer', function () {
        var url = '/answer';
        describe('#GET /answer ', function () {

            it('should return content as type json', function (done) {
                server_promise.then((server) => {
                    request(server)
                        .get(url)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200, done);
                });
            });
            it('should have a property answers', function (done) {
                server_promise.then((server) => {
                    request(server)
                        .get(url)
                        .expect(function(res) {
                            if (!res.body || !res.body.answers) {
                                throw new Error("No answers field returned.");
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
            it('should add an answer', function (done) {
                server_promise.then((server) => {
                    var payload = expectedAnswersData;
                    request(server)
                        .post(url)
                        .send(payload)
                        .set('Accept', 'application/json')
                        .expect(function (res) {
                            if (!res.body.answer.feedback== payload.feedback) {
                                throw new Error("Didn't get expected feedback back.");
                            }
                            if (!res.body.answer.rating== payload.rating) {
                                throw new Error("Didn't get expected rating back.");
                            }
                            if (!res.body.answer.interview_id== payload.interview_id) {
                                throw new Error("Didn't get expected feedback back.");
                            }
                            if (!res.body.answer.question_id== payload.question_id) {
                                throw new Error("Didn't get expected rating back.");
                            }
                            //lets us get the JSON with the id in it too
                            expectedAnswersData.id= res.body.id;
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
      });
  });
