var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};
var firebase = require('firebase');

exports = module.exports = new Resource('user', '/user', {
        get: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.user.findAll().then(function(users) {
                        res.status(200).json({
                            success: true,
                            users: users
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
                    models.user.create({
                        name: req.body.name ? req.body.name : "NULL NAME",
                        role: req.body.role ? req.body.role : "Interviewer"
                    }).then(function(user) {
                        res.status(201).json({
                            user: user.dataValues
                        })
                    })
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }
        }
    }, [new Resource('get_user_by_id', '/:user_name', {
        get: (req, res) => { //get answer by id
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.user.find({
                        where: {
                            name: req.params.user_name
                        }
                    }).then(function(user) {
                        res.status(200).json({
                            user: user
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
                    models.user.find({
                        where: {
                            name: req.params.user_name
                        }
                    }).then(function (user) {
                        user.role = req.body.role;
                        user.save({fields: ['role']}).then(function() {
                            res.status(200).json({});
                        })
                    })
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }
        },
        delete: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.user.destroy({
                        where: {
                            name: req.params.user_name
                        }
                    }).then(function(destroyed) {
                        res.status(204).json({
                        });
                    });
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }
        }
    }), new Resource('get_interviews_by_user', '/:user_name/interviews', {
        get: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.user.findOne({
                        where: {
                            name: req.params.user_name
                        }
                    }).then(function(user) {
                        user.getInterviews().then(function(interviews) {
                            res.status(200).json({
                                interviews: interviews
                            });
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
