var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};
var firebase = require('firebase');

exports = module.exports = new Resource('feedback', '/feedback', {
    get: (req, res) => {
        if(req.query.idToken) {
            firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                var uid = decodedToken.sub;
                models.feedback.findAll().then(function(feedbacks) {
                    res.status(200).json({
                        feedbacks: feedbacks
                    });
                })
            }).catch(function(error) {
                res.status(511).json({error: "Error"});
            });
        } else {
            res.status(401).json({error: "Forbidden"});
        }
    },
    post: (req, res) => {
        if(req.query.idToken) {
            firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                var uid = decodedToken.sub;
                var data = {};
                data[req.body.user] = {
                    rating: req.body.rating ? req.body.rating : -2,
                    note: req.body.note ? req.body.note : null
                };

                models.feedback.create({
                    question_id: req.body.question_id ? req.body.question_id : null,
                    data: data
                }).then(function(created) {
                    res.status(201).json({
                        feedback: created.dataValues
                    });
                })
            }).catch(function(error) {
                res.status(511).json({error: "Error"});
            });
        } else {
            res.status(401).json({error: "Forbidden"});
        }
    }
}, [new Resource('get_feedback_by_id', '/:id', {
    get: (req, res) => {
        if(req.query.idToken) {
            firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                var uid = decodedToken.sub;
                models.feedback.findAll({
                    where: {
                        id: req.params.id
                    }
                }).then(function(feedback) {
                    res.status(200).json({
                        feedback: feedback[0]
                    });
                })
            }).catch(function(error) {
                res.status(511).json({error: "Error"});
            });
        } else {
            res.status(401).json({error: "Forbidden"});
        }
    },
    put: (req, res) => {
        if(req.query.idToken) {
            firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                var uid = decodedToken.sub;
                models.feedback.find({
                    where: {
                        id: req.params.id
                    }
                }).then(function(feedback) {
                    var data = feedback.data;
                    data[req.body.user] = {
                        rating: req.body.rating ? req.body.rating : (feedback.data[req.body.user]? feedback.data[req.body.user].rating : -2),
                        note: req.body.note ? req.body.note : feedback.data[req.body.user].note
                    };

                    feedback.set('data', data);

                    feedback.save({fields: ['data']}).then(function(feedback) {
                        res.status(201).json({feedback: feedback});
                    })
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