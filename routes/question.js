var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};
var firebase = require('firebase');

exports = module.exports = new Resource('question', '/question', {
        get: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.question.findAll().then(function (questions) {
                        res.status(200).json({
                            questions: questions
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
                    if (!req.body.text){
                        req.body.text = 'Blank Text';
                    }

                    if(!req.body.difficulty){
                        req.body.difficulty = 0;
                    }

                    if (!req.body.answers) {
                        req.body.answers = [];
                    }

                    models.question.create({
                        text: req.body.text ? req.body.text : null,
                        difficulty: req.body.difficulty ? req.body.difficulty : 0,
                        answers: req.body.answers ? req.body.answers : null
                    }).then(function (created) {
                        res.status(201).json({
                            question: created.dataValues
                        });
                    })
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }

        }

    }, [new Resource('get_question_by_id', '/:id', {
        //get question by id
        get: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.question.findAll({
                        where: {
                            id: req.params.id
                        }
                    }).then(function (question) {
                        res.status(200).json({
                            question: question[0]
                        });
                    })
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }

        },
        //delete question by id
        delete: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.question.destroy({
                        where: {
                            id: req.params.id
                        }
                    }).then(function (destroyed) {
                        res.status(204).json({});
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
                    models.question.find({
                        where: {
                            id: req.params.id
                        }
                    }).then(function (question) {
                        question.text = req.body.text;
                        question.difficulty = req.body.difficulty;
                        question.answers = req.body.answers;
                        question.save({fields: ['text', 'difficulty', 'answers']}).then(function() {
                            res.status(200).json({});
                        })

                    })
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }

        }
    }), new Resource('add tag to question', '/:id/tags/:tag_name', {
            post: (req, res) => {
                if(req.query.idToken) {
                    firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                        var uid = decodedToken.sub;
                        models.question.findOne({
                            where: {
                                id: req.params.id
                            }
                        }).then(function (question) {
                            models.tag.findOne({
                                where: {
                                    name: req.params.tag_name
                                }
                            }).then(function (tag) {
                                question.addTag(tag).then(function (added) {
                                    res.status(200).json({
                                        added: added
                                    });
                                })
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
                        models.question.findOne({
                            where: {
                                id: req.params.id
                            }
                        }).then(function (question) {
                            models.tag.findOne({
                                where: {
                                    name: req.params.tag_name
                                }
                            }).then(function (tag) {
                                question.removeTag(tag).then( function(removed) {
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
        }), new Resource('get tags by question', '/:id/tags/', {
                get: (req, res) => {
                    if(req.query.idToken) {
                        firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                            var uid = decodedToken.sub;
                            models.question.findOne({
                                where: {
                                    id: req.params.id
                                }
                            }).then(function(question) {
                                question.getTags().then(function(tags){
                                    res.status(200).json({
                                        tags: tags
                                    });
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
                            models.question.findOne({
                                where: {
                                    id: req.params.id
                                }
                            }).then(function (question) {
                                question.setTags([]).then(function(tags) {
                                    res.status(204).json({});
                                })
                            })
                        }).catch(function(error) {
                            res.status(511).json({error: "Error"});
                        });
                    } else {
                        res.status(401).json({error: "Forbidden"});
                    }
                }
        }), new Resource('add interview to question', '/:id/interview/:interview_id', {
                post: (req, res) => {
                    if(req.query.idToken) {
                        firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                            var uid = decodedToken.sub;
                            models.question.findOne({
                                where: {
                                    id: req.params.id
                                }
                            }).then(function(question) {
                                models.interview.findOne({
                                    where: {
                                        id: req.params.interview_id
                                    }
                                }).then(function(interview) {
                                    question.addInterview(interview, {state: req.body.state}).then(function(added) {
                                        res.status(201).json({
                                            added: added
                                        });
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
        })
]);
