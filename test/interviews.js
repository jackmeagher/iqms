require('use-strict');
"use strict";
var request = require('supertest');
var server_promise = require('../bin/www_test');
var expectedInterviewsData = {
  'label': 'test_label',
  'interviewee': 'test_interviewee',
  'interview': 'test_interview'
};

describe('App', function () {
    before(function () {
        server_promise = require('../bin/www_test');
    });
    describe('/interview', function () {
        var url = '/interview';
        describe('#GET /interview ', function () {

            it('should return content as type json', function (done) {
                server_promise.then((server) => {
                    request(server)
                        .get(url)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200, done);
                });
            });
            it('should have a property interview, interviewee, and label', function (done) {
                server_promise.then((server) => {
                    request(server)
                        .get(url)
                        .expect(function(res) {
                            if (!res.body || !res.body.interviews) {
                                throw new Error("No interview field returned.");
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
            it('should add an interview', function (done) {
                server_promise.then((server) => {
                    var payload = expectedInterviewsData;
                    request(server)
                        .post(url)
                        .send(payload)
                        .set('Accept', 'application/json')
                        .expect(function (res) {
                            if (!res.body.interview.label== payload.label) {
                                throw new Error("Didn't get expected label back.");
                            }
                            if (!res.body.interview.interviewee== payload.interviewee) {
                                throw new Error("Didn't get expected interviewee back.");
                            }
                            //lets us get the JSON with the id in it too
                            expectedInterviewsData.id= res.body.id;
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

        describe('#ID', function() {
            it('should return interview by id', function(done) {
                var idurl= url + '/' + expectedInterviewsData.id;
                server_promise.then( (server) => {
                    request(server)
                        .get(idurl)
                        .expect(function (res) {
                          if (!res.body.interview.label== expectedInterviewsData.label) {
                              throw new Error("Didn't get expected label back.");
                          }
                          if (!res.body.interview.interviewee== expectedInterviewsData.interviewee) {
                              throw new Error("Didn't get expected interviewee back.");
                          }
                        }).end(function (err, res) {
                        if (err) {
                            done(err);
                        } else {
                            done();
                        }

                    });
                });
            });
        });
        describe('#DELETE', function() {
            it('should delete and return interview by id', function(done) {
                var idurl= url + '/' + expectedInterviewsData.id;
                server_promise.then( (server) => {
                    request(server)
                        .delete(idurl)
                        .expect(function (res) {
                          if (!res.body.interview.label== expecteInterviewsData.label) {
                              throw new Error("Didn't get expected label back.");
                          }
                          if (!res.body.interview.interviewee== expecteInterviewsData.interviewee) {
                              throw new Error("Didn't get expected interviewee back.");
                          }
                        }).end(function (err, res) {
                        if (err) {
                            done(err);
                        } else {
                            done();
                        }

                    });
                });
            });
        });

        describe('#ID2', function() {
            it('should return questions by id', function(done) {
                var idurl= url + expectedInterviewsData.id + '/questions';
                server_promise.then( (server) => {
                    request(server)
                        .get(idurl)
                        .expect(function (res) {
                          if (!res.body || !res.body.questions) {
                              throw new Error("No questions field returned.");
                          }
                        }).end(function (err, res) {
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
