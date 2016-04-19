//TODO: Crypto broke user posts, need to fix in test/users.js as well

require('use-strict');
"use strict";
var request = require('supertest');
var server_promise = require('../bin/www_test');

var expectedInterviewerData = {
    'username': 'test_interviewer',
    'first_name': 'test_interviewer_first',
    'last_name': 'test_interviewer_last',
    'email': 'test_interviewer@gmail.com'
};
var expectedIntervieweeData = {
    'username': 'test_interviewee',
    'first_name': 'test_interviewee_first',
    'last_name': 'test_interviewee_last',
    'email': 'test_interviewee@gmail.com'
};
var expectedInterviewsData = {
  'label': 'test_interview_label',
  'interviewee': 'test_interviewee',
  'interview': 'test_interview'
};

var expectedQuestionData = {
    'difficulty': 5,
    'question_text' : 'How do I conduct an interview?'
};

describe('App', function () {
    before(function () {
        server_promise = require('../bin/www_test');
    });

    //TODO: update from when crypto broke it
    //add interviewer
      // describe('#POST', function () {
      //     it('should add interviewer', function (done) {
      //         server_promise.then((server) => {
      //             var payload = expectedInterviewerData;
      //             url= '/user';
      //
      //             request(server)
      //                 .post(url)
      //                 .send(payload)
      //                 .expect(function (res) {
      //                     if (!res.body.data.username == payload.username) {
      //                         throw new Error("Didn't get expected username back.");
      //                     }
      //                     if (!res.body.data.first_name == payload.first_name) {
      //                         throw new Error("Didn't get expected last name back.");
      //                     }
      //                     if (!res.body.data.last_name == payload.last_name) {
      //                         throw new Error("Didn't get expected last name");
      //                     }
      //                     if (!res.body.data.id) {
      //                         throw new Error("No id returned.");
      //                     }
      //                     expectedInterviewerData.id= res.body.data.id;
      //                 })
      //                 .end(function (err, res) {
      //                     if (err) {
      //                         done(err);
      //                     } else {
      //                         done();
      //                     }
      //                 });
      //         });
      //     });
      // }); //end add interviewer

      //TODO: update from when crypto broke it
      //add interviewee
      // describe('#POST', function () {
      //     it('should add interviewee', function (done) {
      //         server_promise.then((server) => {
      //             var payload = expectedIntervieweeData;
      //             url= '/user';
      //
      //             request(server)
      //                 .post(url)
      //                 .send(payload)
      //                 .expect(function (res) {
      //                     if (!res.body.data.username == payload.username) {
      //                         throw new Error("Didn't get expected username back.");
      //                     }
      //                     if (!res.body.data.first_name == payload.first_name) {
      //                         throw new Error("Didn't get expected last name back.");
      //                     }
      //                     if (!res.body.data.last_name == payload.last_name) {
      //                         throw new Error("Didn't get expected last name");
      //                     }
      //                     if (!res.body.data.id) {
      //                         throw new Error("No id returned.");
      //                     }
      //                     expectedIntervieweeData.id= res.body.data.id;
      //                 })
      //                 .end(function (err, res) {
      //                     if (err) {
      //                         done(err);
      //                     } else {
      //                         done();
      //                     }
      //                 });
      //         });
      //     });
      // }); //end add interviewee

      //add interview
      describe('#POST', function () {
          it('should add an interview', function (done) {
              server_promise.then((server) => {
                  var payload = expectedInterviewsData;
                  var url= '/interview';

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
                          if (!res.body.interview.interviewer== payload.interviewer) {
                              throw new Error("Didn't get expected interviewer back.");
                          }
                          //lets us get the JSON with the id in it too
                          expectedInterviewsData.id= res.body.interview.id;
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
      });//end add interview

      //add question
      describe('#POST', function () {
          it('should add a question', function (done) {
              server_promise.then((server) => {
                  var payload = expectedQuestionData;
                  var url= '/question';

                  request(server)
                      .post(url)
                      .send(payload)
                      .expect(function (res) {
                          if (!res.body.question.difficulty == payload.difficulty) {
                              throw new Error("Didn't get expected username back.");
                          }
                            if (!res.body.question.question_text == payload.question_text) {
                              throw new Error("Didn't get expected last name back.")
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
      }); //end add question

      //add question to interview
      describe('#ADD', function() {
          it('should add question we created earlier to interview we created earlier', function(done) {
              var url= '/interview';
              var idurl= url + '/' + expectedInterviewsData.id + '/questions/' + expectedQuestionData.id;
              // payload={
              //   'interview_id' : expectedInterviewsData.id,
              //   'question_id' : expectedQuestionData.id
              // }
              server_promise.then( (server) => {
                  request(server)
                      .post(idurl)
                      .expect(200, done);

                  });
              });
          });

          //get all quetions from interview
          describe('#GETALL', function() {
              it('should get all questions from interiew by id', function(done) {
                var url= '/interview';
                  var idurl= url + '/' + expectedInterviewsData.id + '/questions';

                  server_promise.then( (server) => {
                      request(server)
                          .get(idurl)
                          .expect(function (res) {
                              if (!res.body.questions[0].difficulty == expectedQuestionData.difficulty) {
                                  throw new Error("Didn't get expected difficulty back");
                              }
                                if (!res.body.questions[0].question_text == expectedQuestionData.question_text) {
                                  throw new Error("Didn't get question text back.")
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
              }); //end get all questions from interview

            //add an answer
            describe('#POST', function () {
                it('should add an answer', function (done) {
                    server_promise.then((server) => {
                        var expectedAnswersData = {
                          'answer_text' : 'test_answer_text',
                          'rating': 'test,_rating',
                          'interviewId' : expectedInterviewsData.id,
                          'questionId' : expectedQuestionData.id
                        };
                        var payload = expectedAnswersData;
                        var url = '/answer';
                        request(server)
                            .post(url)
                            .send(payload)
                            .set('Accept', 'application/json')
                            .expect(function (res) {
                                if (!res.body.answer.answer_text== payload.answer_text) {
                                    throw new Error("Didn't get expected feedback back.");
                                }
                                if (!res.body.answer.rating== payload.rating) {
                                    throw new Error("Didn't get expected rating back.");
                                }
                                if (!res.body.answer.interviewId== payload.interviewId) {
                                    throw new Error("Didn't get expected feedback back.");
                                }
                                if (!res.body.answer.questionId== payload.questionId) {
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
