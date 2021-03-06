require('use-strict');
"use strict";
var request = require('supertest');
var server_promise = require('../bin/www_test');
var expectedRolesData = {
    'type': 'mocha_test'
};

describe('App', function () {
    before(function () {
        server_promise = require('../bin/www_test');
    });
    describe('/role', function () {
        var url = '/role';
        describe('#GET /role ', function () {

            it('should return content as type json', function (done) {
                server_promise.then((server) => {
                    request(server)
                        .get(url)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200, done);
                });
            });
            it('should have a property role', function (done) {
                server_promise.then((server) => {
                    request(server)
                        .get(url)
                        .expect(function(res) {
                            if (!res.body || !res.body.role) {
                                throw new Error("No roles field returned.");
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
            it('should add a role', function (done) {
                server_promise.then((server) => {
                    var payload = expectedRolesData;

                    request(server)
                        .post(url)
                        .send(payload)
                        .expect(function (res) {
                            if (!res.body.role.type== payload.type) {
                                throw new Error("Didn't get expected role back.");
                            }
                            //lets us get the JSON with the id in it
                            expectedRolesData.id= res.body.id;
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
            it('should return the role we added earlier', function (done) {
                server_promise.then((server) => {
                    request(server)
                        .get(url)
                        .expect(function (res) {
                            if (!res.body || !res.body.role) {
                                throw new Error("No roles field returned.");
                            }
                            if (!res.body.role[0]) {
                                throw new Error("No roles returned, even though one was just added.");
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

        // role creation values left unimplemented
        //  uncomment test when implemented

        // describe('#ID', function() {
        //     it('should return role by id', function(done) {
        //         var idurl= url + '/' + expectedRolesData.id;
        //         server_promise.then( (server) => {
        //             request(server)
        //                 .get(idurl)
        //                 .expect(function (res) {
        //                     if (!res.body.role.type== expectedRolesData.type) {
        //                         throw new Error("Didn't get expected role back.");
        //                     }
        //                 }).end(function (err, res) {
        //                 if (err) {
        //                     done(err);
        //                 } else {
        //                     done();
        //                 }
        //
        //             });
        //         });
        //     });
        // });

        // role creation values left unimplemented
        //  uncomment test when implemented

        // describe('#DELETE', function() {
        //     it('should return role by id', function(done) {
        //         var idurl= url + '/' + expectedRolesData.id;
        //         server_promise.then( (server) => {
        //             request(server)
        //                 .delete(idurl)
        //                 // .expect(204);
        //                 .expect(function (res) {
        //                     if (!res.body || !res.body.roles) {
        //                         throw new Error("No roles field returned.");
        //                     }
        //                     if (!res.body.roles) {
        //                         throw new Error("No roles returned, even though one was just deleted.");
        //                     }
        //                     if (!res.body.data.type== expectedRolesData.body.type) {
        //                         throw new Error("Didn't get expected role back.");
        //                     }
        //                 }).end(function (err, res) {
        //                 if (err) {
        //                     done(err);
        //                 } else {
        //                     done();
        //                 }
        //             });
        //         });
        //     });
        // });
    });
});
