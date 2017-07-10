var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};
var firebase = require('firebase');

exports = module.exports = new Resource('interview', '/interview', {
        get: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.interview.findAll().then(function (interviews) {
                        res.status(200).json({
                            interviews: interviews
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
                    models.interview.create({
                        candidatePositionId : req.body.candidatePositionCId ? req.body.candidatePositionCId : null,
                        conducted: req.body.conducted ? req.body.conducted : false,
                        started: req.body.started ? req.body.started : false,
                        recommendation: req.body.recommendation ? req.body.recommendation : {},
                        date: req.body.date ? req.body.date : "",
                        location: req.body.date ? req.body.date : ""
                    }).then(function (created) {
                        res.status(201).json({
                            interview: created.dataValues
                        });
                    })
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }
        }
    },
    [new Resource('get_interview_by_id', '/:id', {
            get: (req, res) => {
                 if(req.query.idToken) {
                    firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                        var uid = decodedToken.sub;
                        models.interview.findAll({
                            where: {
                                id: req.params.id
                            }
                        }).then(function (interview) {
                            res.status(200).json({
                                interview: interview[0]
                            });
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
                        models.interview.destroy({
                            where: {
                                id: req.params.id
                            }
                        }).then(function (destroyed) {
                            res.status(200).json({});
                        });
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
                        models.interview.find({
                            where: {
                                id: req.params.id
                            }
                        }).then(function(interview) {
                            if(req.body.candidatePositionCId) {
                                interview.candidatePositionCId = req.body.candidatePositionCId;
                            }
                            if(req.body.conducted) {
                                interview.conducted = req.body.conducted ? req.body.conducted : false;
                            }
                            if(req.body.date) {
                                interview.date = req.body.date;
                            }
                            if(req.body.location) {
                                interview.location = req.body.location;
                            }
                            if(req.body.started) {
                                interview.started = req.body.started;
                            }
                            var rec = interview.recommendation;
                            if (req.body.user) {
                                rec[req.body.user] = {
                                    recommendation: req.body.recommendation ? req.body.recommendation : null
                                };
                                interview.set('recommendation', rec);
                            }
                            interview.save({fields: ['candidatePositionCId', 'conducted', 'recommendation', 'date', 'location', 'started']}).then(function(interview) {
                                res.status(200).json({interview: interview});
                            })
                        })
                    }).catch(function(error) {
                        res.status(511).json({error: "Error"});
                    });
                } else {
                    res.status(401).json({error: "Forbidden"});
                }
            }
        }), new Resource('get_questions_from_interview', '/:id/questions', {
            get: (req, res) => {
                if(req.query.idToken) {
                    firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                        var uid = decodedToken.sub;
                        models.interview.findOne({
                            where: {
                                id: req.params.id
                            }
                        }).then(function (interview) {
                            questions :  interview.getQuestions().then(function (questions) {
                                res.status(200).json({
                                    questions: questions
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
                        models.interview.findOne({
                            where: {
                                id: req.params.id
                            }
                        }).then(function(interview) {
                            interview.setQuestions([]).then(function(questions) {
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
        }), new Resource('get_tags_from_interview', '/:id/tags', {
            get: (req, res) => {
                if(req.query.idToken) {
                    firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                        var uid = decodedToken.sub;
                        models.interview.findOne({
                            where: {
                                id: req.params.id
                            }
                        }).then(function(interview) {
                            interview.getTags().then(function(tags) {
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
                        models.interview.findOne({
                            where: {
                                id: req.params.id
                            }
                        }).then(function(interview) {
                            interview.setTags([]).then(function(tags) {
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
        }), new Resource('add_remove_question_to_interview', '/:id/questions/:question_id', {
            post: (req, res) => {
                if(req.query.idToken) {
                    firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                        var uid = decodedToken.sub;
                        models.interview.findOne({
                            where: {
                                id: req.params.id
                            }
                        }).then(function(interview) {
                            models.question.findOne({
                                where: {
                                    id: req.params.question_id
                                }
                            }).then(function(question) {
                                interview.addQuestion(question).then(function(added) {
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
                        models.interview.findOne({
                            where: {
                                id: req.params.id
                            }
                        }).then(function(interview) {
                            models.question.findOne({
                                where: {
                                    id: req.params.question_id
                                }
                            }).then(function(question) {
                                interview.removeQuestion(question).then(function(removed) {
                                    res.status(200).json({
                                        removed: removed
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
        }), new Resource('get_feedback_from_interview', '/:id/feedback', {
            get: (req, res) => {
                if(req.query.idToken) {
                    firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                        var uid = decodedToken.sub;
                        models.interview.findOne({
                            where: {
                                id: req.params.id
                            }
                        }).then(function(interview) {
                            interview.getFeedbacks().then(function(feedbacks) {
                                res.status(200).json({
                                    feedbacks: feedbacks
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
        }), new Resource('add_feedback_to_interview', '/:id/feedback/:feedback_id', {
            post: (req, res) => {
                if(req.query.idToken) {
                    firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                        var uid = decodedToken.sub;
                        models.interview.findOne({
                            where: {
                                id: req.params.id
                            }
                        }).then(function (interview) {
                            models.feedback.findOne({
                                where: {
                                    id: req.params.feedback_id
                                }
                            }).then(function (feedback) {
                                interview.addFeedback(feedback).then(function (added) {
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
            }
        }), new Resource('get_feedback_from_interview_withQuestionID', '/:id/feedback/:question_id', {
            get: (req, res) => {
                if(req.query.idToken) {
                    firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                        var uid = decodedToken.sub;
                        models.interview.findOne({
                            where: {
                                id: req.params.id
                            }
                        }).then(function(interview) {
                            interview.getFeedbacks({where: ['question_id = ?', [req.params.question_id]]}).then(function(feedbacks) {
                                res.status(200).json({
                                    feedbacks: feedbacks
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
        }), new Resource('get_users_for_interview', '/:id/users', {
            get: (req, res) => {
                if(req.query.idToken) {
                    firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                        var uid = decodedToken.sub;
                        models.interview.findOne({
                            where: {
                                id: req.params.id
                            }
                        }).then(function(interview) {
                            interview.getUsers().then(function(users) {
                                res.status(200).json({
                                    users: users
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
                        models.answer.destroy({
                            where: {
                                interview_id: req.params.id
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
            }
        }),
        new Resource('add_user_to_interview', '/:id/user/:user_name', {
                post: (req, res) => {
                    if(req.query.idToken) {
                        firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                            var uid = decodedToken.sub;
                            models.interview.findOne({
                                where: {
                                    id: req.params.id
                                }
                            }).then(function (interview) {
                                models.user.findOne({
                                    where: {
                                        name: req.params.user_name
                                    }
                                }).then(function (user) {
                                    interview.addUser(user).then(function (added) {
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
                            models.interview.findOne({
                                where: {
                                    id: req.params.id
                                }
                            }).then(function(interview) {
                                models.user.findOne({
                                    where: {
                                        name: req.params.user_name
                                    }
                                }).then(function(user) {
                                    interview.removeUser(user).then(function(removed) {
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
        })

]);
