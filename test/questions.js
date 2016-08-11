describe('Question Post Mechanics', function() {

    var questionTextBox = element(by.id('question_text'));
    var difficulty = element(by.id('midDiff'));
    var slider = element(by.id('modelValue'));
    var userBox = element(by.model('user.email'));
    var passBox = element(by.model('user.password'));
    var history = element.all(by.repeater('(key, value) in questionData.selectedTags'));
    var userInfo = {
        name: 'bytecodedesigns@gmail.com',
        password: 'testpass1234'
    }

    beforeEach(function() {
       browser.get('http://localhost:3000/static/www/#/');
    })

    it('Should be able to enter all question parameters', function() {
        userBox.sendKeys(userInfo.name);
        passBox.sendKeys(userInfo.password);
        browser.wait(function(){
            return element(by.id('question_text')).isPresent();
        });

        //Testing the text box
        questionTextBox.sendKeys("What is the difference between an abstract class and an interface?");
        expect(questionTextBox.getAttribute('value')).toEqual('What is the difference between an abstract class and an interface?');

        //Difficulty testing
        difficulty.click();
        expect(slider.getAttribute('value')).toEqual('5');

        //Tag radio testing
        expect(history.last().getText()).toContain('Skills');
        element(by.id('inlineRadio1')).click();
        expect(history.last().getText()).toContain('Intro');
        element(by.id('inlineRadio2')).click();
        expect(history.last().getText()).toContain('Skills');
        element(by.id('inlineRadio3')).click();
        expect(history.last().getText()).toContain('Close');
        element(by.id('inlineRadio2')).click();

        //Tag testing
        element(by.css("md-autocomplete input#tagBox")).click();
        element(by.css("md-autocomplete input#tagBox")).sendKeys('OOP');
        element(by.css('.md-autocomplete-suggestions li')).click();
        expect(history.last().getText()).toContain('OOP');

        element(by.css("md-autocomplete input#tagBox")).click();
        element(by.css("md-autocomplete input#tagBox")).clear();
        element(by.css("md-autocomplete input#tagBox")).sendKeys('Java');
        element(by.css('.md-autocomplete-suggestions li')).click();
        expect(history.last().getText()).toContain('Java');

        browser.driver.sleep(1500);

        //Answer testing
        expect(element.all(by.repeater('answer in questionData.answers')).count()).toEqual(1);
        var targetElement =  element(by.id('addAnswerButton'));
        element(by.id('addAnswerButton')).click();
        element(by.id('addAnswerButton')).click();
        element(by.id('addAnswerButton')).click();
        expect(element.all(by.repeater('answer in questionData.answers')).count()).toEqual(4);
        element(by.id('removeAnswerButton')).click();
        browser.waitForAngular();
        expect(element.all(by.repeater('answer in questionData.answers')).count()).toEqual(3);
        element(by.id('questionDataanswer0')).sendKeys("An abstract class can have implementation for a method but an interface cannot")
        expect(element(by.id('questionDataanswer0')).getAttribute('value')).toEqual("An abstract class can have implementation for a method but an interface cannot");
        element(by.id('removeAnswerButton')).click();
        element(by.id('removeAnswerButton')).click();

        //Submitting testing
        element(by.id('submitQuestion')).click();

        browser.driver.sleep(1500);

        expect(element.all(by.repeater('question in _question')).last().getText()).toContain('What is the difference between an abstract class and an interface?');
        element.all(by.repeater('question in _question')).last().element(by.className('delete-question')).click();
        browser.pause();
    });
});

/*require('use-strict');
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
*/