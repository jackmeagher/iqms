require('use-strict');
"use strict";
var request = require('supertest');
var server_promise = require('../bin/www_test');
var expectedPositionsData = {
    'title': 'mocha_test_title'
};

describe('App', function () {
    before(function () {
        server_promise = require('../bin/www_test');
    });
    describe('/position', function () {
        var url = '/position';
        describe('#GET /position ', function () {

            it('should return content as type json', function (done) {
                server_promise.then((server) => {
                    request(server)
                        .get(url)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200, done);
                });
            });
            it('should have a property position', function (done) {
                server_promise.then((server) => {
                    request(server)
                        .get(url)
                        .expect(function(res) {
                            if (!res.body || !res.body.positions) {
                                throw new Error("No positions field returned.");
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
            it('should add a position', function (done) {
                server_promise.then((server) => {
                    var payload = expectedPositionsData;

                    request(server)
                        .post(url)
                        .send(payload)
                        .expect(function (res) {
                            if (!res.body.data.title== payload.type) {
                                throw new Error("Didn't get expected position back.");
                            }
                            //lets us get the JSON with the id in it
                            expectedPositionsData= res;
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
