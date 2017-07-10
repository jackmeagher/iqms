var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};
var firebase = require('firebase');

exports = module.exports = new Resource('interviewQuestion', '/interviewQuestion', {
        get: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.interviewQuestion.findAll().then(function (iq) {
                        res.status(200).json({
                            iq: iq
                        });
                    })
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }
        }
    }, [new Resource('get with ids', '/:id/question/:qId', {
        get: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.interviewQuestion.find({
                        where: {
                            interviewId: req.params.id,
                            questionId: req.params.qId
                        }
                    }).then(function (interviewQuestion) {
                        res.status(200).json({
                            interviewQuestion: interviewQuestion
                        });
                    })
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }
        }
    }), new Resource('get with question id', '/:id', {
        get: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.interviewQuestion.find({
                        where: {
                            questionId: req.params.id
                        }
                    }).then(function(result) {
                        res.status(200).json({
                            result: result
                        });
                    })
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }
        }
    }), new Resource('get with question id and interviewId', '/:id/interview/:interview_id', {
        get: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.interviewQuestion.find({
                        where: {
                            questionId: req.params.id,
                            interviewId: req.params.interview_id
                        }
                    }).then(function(result) {
                        res.status(200).json({
                            result: result
                        });
                    })
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }
        }
    })
]);
