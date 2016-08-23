var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};
var firebase = require('firebase');

exports = module.exports = new Resource('tag', '/tag', {
    get: (req, res) => {
        if(req.query.idToken) {
            firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                var uid = decodedToken.sub;
                models.tag.findAll().then(function(tags) {
                    res.status(200).json({tags: tags});
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
                if (!req.query.name) {
                    req.query.name = 'Blank';
                }
                req.body.name = req.body.name.toLowerCase();
                models.tag.create( {
                    name: req.body.name ? req.body.name : null
                }).then(function(created) {
                    res.status(201).json({tag: created.dataValues});
                })
            }).catch(function(error) {
                res.status(511).json({error: "Error"});
            });
        } else {
            res.status(401).json({error: "Forbidden"});
        }
    }
}, [new Resource('get_tag_by_id', '/:name', {
    get: (req, res) => {
        if(req.query.idToken) {
            firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                var uid = decodedToken.sub;
                req.params.name = req.params.name.toLowerCase();
                models.tag.find({
                    where: {
                        name: req.params.name
                    }
                }).then(function (tag) {
                    res.status(200).json({
                        tag: tag
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
                req.params.name = req.params.name.toLowerCase();
                models.tag.find({
                    where: {
                        name: req.params.name
                    }
                }).then(function (tag) {
                    tag.count = req.body.count;
                    tag.save({fields: ['count']}).then(function() {
                        res.status(200).json({tag: tag});
                    })
                })
            }).catch(function(error) {
                res.status(511).json({error: "Error"});
            });
        } else {
            res.status(401).json({error: "Forbidden"});
        }
    }
}), new Resource('get questions by tag', '/:name/questions/', {
    get: (req, res) => {
        if(req.query.idToken) {
            firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                req.params.name = req.params.name.toLowerCase();
                var uid = decodedToken.sub;
                models.tag.findOne({
                    where: {
                        name: req.params.name
                    }
                }).then(function(tag) {
                    tag.getQuestions({order: [['difficulty', 'ASC']]}).then ( function(questions) {
                        res.status(200).json({
                            questions: questions
                        })
                    })
                })
            }).catch(function(error) {
                res.status(511).json({error: "Error"});
            });
        } else {
            res.status(401).json({error: "Forbidden"});
        }
    }
}), new Resource('add tags to interview', '/:name/interview/:interview_id', {
    post: (req, res) => {
        if(req.query.idToken) {
            firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                req.params.name = req.params.name.toLowerCase();
                var uid = decodedToken.sub;
                models.tag.findOne({
                    where: {
                        name: req.params.name
                    }
                }).then(function(tag) {
                    if(tag) {
                        models.interview.findOne({
                            where: {
                                id: req.params.interview_id
                            }
                        }).then(function(interview) {
                            tag.addInterview(interview).then(function(added) {
                                res.status(200).json({
                                    added: added
                                });
                            })
                        })
                    }

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
                req.params.name = req.params.name.toLowerCase();
                var uid = decodedToken.sub;
                models.tag.findOne({
                    where: {
                        name: req.params.name
                    }
                }).then(function(tag) {
                    models.interview.findOne({
                        where: {
                            id: req.params.interview_id
                        }
                    }).then(function(interview) {
                        tag.removeInterview(interview).then(function(removed) {
                            res.status(204).json({});
                        })
                    })
                })
            }).catch(function(error) {
                res.status(511).json({error: "Error"});
            });
        } else {
            res.status(401).json({error: "Forbidden"});
        }
    }
})]);