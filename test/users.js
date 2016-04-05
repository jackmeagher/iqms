require('use-strict');
"use strict";
var request = require('supertest');
var server_promise = require('../bin/www_test');

var expectedUsersData = {
    'username': 'testman_username',
    'first_name': 'testman_first',
    'last_name': 'testman_last',
    'email': 'testman@gmail.com'
};

describe('App', function () {
    before(function () {
        server_promise = require('../bin/www_test');
    });
    describe('/user', function() {
        var url = '/user';
        describe('#GET /user ', function () {

            it('should return content as type json', function (done) {
                server_promise.then((server) => {
                    request(server)
                        .get(url)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200, done);
                });
            });
            it('should have a property users', function (done) {
                server_promise.then((server) => {
                    request(server)
                        .get(url)
                        .expect(function(res) {
                            if (!res.body || !res.body.users) {
                                throw new Error("No users field returned.");
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
            it('should add a user', function (done) {
                server_promise.then((server) => {
                    var payload = expectedUsersData;

                    request(server)
                        .post(url)
                        .send(payload)
                        .expect(function (res) {
                            if (!res.body.data.username == payload.username) {
                                throw new Error("Didn't get expected username back.");
                            }
                            if (!res.body.data.first_name == payload.first_name) {
                                throw new Error("Didn't get expected last name back.");
                            }
                            if (!res.body.data.last_name == payload.last_name) {
                                throw new Error("Didn't get expected last name");
                            }
                            if (!res.body.data.id) {
                                throw new Error("No id returned.");
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

        describe('#GET2', function () {
            it('should return the user we added earlier', function (done) {
                server_promise.then((server) => {
                    request(server)
                        .get(url)
                        .expect(function (res) {
                            if (!res.body || !res.body.users) {
                                throw new Error("No users field returned.");
                            }
                            if (!res.body.users[0]) {
                                throw new Error("No users returned, even though one was just added.");
                            }
                            if (!res.body.users[0].email == expectedUsersData.email) {
                                throw new Error("Wrong email returned.");
                            }
                            if (!res.body.users[0].username == expectedUsersData.username) {
                                throw new Error("Wrong username returned.");
                            }
                            if (!res.body.users[0].first_name == expectedUsersData.first_name) {
                                throw new Error("Wrong first name returned.");
                            }
                            if (!res.body.users[0].last_name == expectedUsersData.last_name) {
                                throw new Error("Wrong last name returned.");
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


    });
    describe('/question', function() {
        var url ='/question';
        var question_data = {
            'difficulty': 5,
            'question_text' : 'How does the JVM handle tail-end recursion?'
        };
        describe('#GET', function() {
            it('should return content-type json and code 200', function(done) {
                server_promise.then( (server) => {
                    request(server)
                        .get(url)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200, done);
                });
            });
        });

        describe('#POST', function() {
            it('should add a question', function(done) {
                server_promise.then( (server) => {
                    request(server)
                        .post(url)
                        .send(question_data)
                        .expect(function(res) {
                            if (!res.body.question) {
                                throw new Error("No question returned.");
                            }
                            if (!res.body.question.difficulty == question_data.difficulty) {
                                throw new Error("Incorrect question difficulty returned.");
                            }
                            if (!res.body.question.question_text == question_data.question_text) {
                                throw new Error("Incorrect question text returned.");
                            }
                            if (!res.body.question.id) {
                                throw new Error("No id returned.");
                            }
                        })
                        .end(function(err, res) {
                            if(err) {
                                done(err);
                            } else {
                                done();
                            }
                        });

                });
            });
        });

        describe('#GET2', function() {
           it('should return the question we added earlier', function (done) {
               server_promise.then( (server) => {
                   request(server)
                       .get(url)
                       .expect(function(res) {
                           if (!res.body || !res.body.questions) {
                               throw new Error("No questions field returned.");
                           }
                           if (!res.body.questions[0]) {
                               throw new Error("No questions returned, even though one was just added.");
                           }
                           if (!res.body.questions[0].difficulty == question_data.difficulty) {
                               throw new Error("Wrong question difficulty returned.");
                           }
                           if (!res.body.questions[0].question_text == question_data.question_text) {
                               throw new Error("Wrong question text returned.");
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
    });
});
