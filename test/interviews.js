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
    describe('/role', function () {
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
                        .expect(function (res) {
                            if (!res.body.data.label== payload.label) {
                                throw new Error("Didn't get expected label back.");
                            }
                            if (!res.body.data.interview== payload.interview) {
                                throw new Error("Didn't get expected interview back.");
                            }
                            if (!res.body.data.interviewee== payload.interviewee) {
                                throw new Error("Didn't get expected interviewee back.");
                            }
                            //lets us get the JSON with the id in it too
                            expectedInterviewsData= res;
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

        describe('#GET2', function () {
            it('should return the interview we added earlier', function (done) {
                server_promise.then((server) => {
                    request(server)
                        .get(url)
                        .expect(function (res) {
                            if (!res.body || !res.body.interviews) {
                                throw new Error("No interview field returned.");
                            }
                            if (!res.body.interviews[0]) {
                                throw new Error("No interview returned, even though one was just added.");
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

        })

        describe('#ID', function() {
            it('should return interview by id', function(done) {
                var payload.id= expectedInterviewsData.body.id;
                idurl= url + '/:id';
                server_promise.then( (server) => {
                    request(server)
                        .get(idurl)
                        .send(payload)
                        .expect(function (res) {
                          if (!res.body.data.label== payload.label) {
                              throw new Error("Didn't get expected label back.");
                          }
                          if (!res.body.data.interview== payload.interview) {
                              throw new Error("Didn't get expected interview back.");
                          }
                          if (!res.body.data.interviewee== payload.interviewee) {
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
                var payload.id= expectedInterviewsData.body.id;
                server_promise.then( (server) => {
                    request(server)
                        .delete(url)
                        .send(payload)
                        .expect(204);
                        .expect(function (res) {
                          if (!res.body.data.label== payload.label) {
                              throw new Error("Didn't get expected label back.");
                          }
                          if (!res.body.data.interview== payload.interview) {
                              throw new Error("Didn't get expected interview back.");
                          }
                          if (!res.body.data.interviewee== payload.interviewee) {
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
                var payload.id= expectedInterviewsData.id;
                idurl= url + '/:id/questions';
                server_promise.then( (server) => {
                    request(server)
                        .get(idurl)
                        .send(payload)
                        .expect(200)
                        .expect(function (res) {
                          if (!res.body || !res.body.questions) {
                              throw new Error("No interview field returned.");
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
