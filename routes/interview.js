var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};

exports = module.exports = new Resource('interview', '/interview', {
        get: (req, res) => {
            models.interview.findAll()
                .then(function (interviews) {
                    res.status(200).json({
                        interviews: interviews
                    });
                })
        },
        post: (req, res) => {
            models.interview.create({
                candidatePositionId : req.body.candidatePositionCId ? req.body.candidatePositionCId : null,
                interviewerId : req.body.interviewerId ? req.body.interviewerId : null
            }).then(function (created) {
                    res.status(201).json({
                        interview: created.dataValues
                    });
                })
        }
    },
    [
        new Resource('get_interview_by_id', '/:id', {
            // get interview
            get: (req, res) => { //get interview by id
                models.interview.findAll({
                    where: {
                        id: req.params.id
                    }
                }).then(function (interview) {
                    res.status(200).json({
                        interview: interview[0]
                    });
                })
            },


            // delete interview
            delete: (req, res) => {
                models.interview.destroy({
                    where: {
                        id: req.params.id
                    }
                }).then(function (destroyed) {
                    res.status(200).json({});
                });

            },
            
            put: (req, res) => {
                models.interview.find({
                    where: {
                        id: req.params.id
                    }
                })
                .then(function(interview) {
                  interview.candidatePositionCId = req.body.candidatePositionCId;
                  interview.interviewerId = req.body.interviewerId;
                  interview.save({fields: ['candidatePositionCId', 'interviewerId']}).then(function(interview) {
                    res.status(200).json({interview: interview});
                  })
                })
            }


        }),

        new Resource('get_questions_from_interview', '/:id/questions', {
            /// get all questions from interview
            get: (req, res) => {
                models.interview.findOne({
                    where: {
                        id: req.params.id
                    }
                }).then(function (interview) {

                        questions :  interview.getQuestions().then(function (questions) {
                                res.status(200).json(
                                    {
                                        questions: questions
                                    }
                                )
                            }
                        )
                    }
                )

            }

            ,
            /// delete all questions from interview
            delete: (req, res) => {
                models.interview.findOne({
                        where: {
                                id: req.params.id
                        }
                }).then(function(interview) {
                        interview.setQuestions([]).then(function(questions) {
                                res.status(204).json({});      
                        })
                })

            }


        }),
        
        new Resource('get_questions_from_interview', '/:id/tags', {
                
                get: (req, res) => {
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
                        
                },
            /// delete all questions from interview
            delete: (req, res) => {
                models.interview.findOne({
                        where: {
                                id: req.params.id
                        }
                }).then(function(interview) {
                        interview.setTags([]).then(function(tags) {
                                res.status(204).json({});      
                        })
                })

            }


        }),


        new Resource('add_remove_question_to_interview', '/:id/questions/:question_id', {
            /// add question to interview
            post: (req, res) => {

                models.interview.findOne({
                    where: {
                        id: req.params.id
                    }
                }).then(function (interview) {
                    models.question.findOne(
                        {
                            where: {
                                id: req.params.question_id
                            }
                        }).then(function (question) {
                        interview.addQuestion(question).then(
                            function (added) {
                                res.status(200).json({
                                    added: added
                                });
                            }
                        )

                    })
                })
            },

            /// remove question from interview
            delete: (req, res) => {
                models.interview.findOne({
                    where: {
                        id: req.params.id
                    }
                }).then(function (interview) {
                    models.question.findOne(
                        {
                            where: {
                                id: req.params.question_id
                            }
                        }).then(function (question) {
                        interview.removeQuestion(question).then(
                            function (added) {
                                res.status(200).json({
                                    removed: removed
                                });
                            }
                        )

                    })
                })

            }

        }),

        new Resource('get_answers_from_interview', '/:id/answers', {
            /// get all answers from interview
            get: (req, res) => {
                models.sequelize.query('SELECT * FROM answers WHERE "interviewId" =' + req.params.id
                    , {type: models.sequelize.QueryTypes.SELECT}
                    )
                    .then(function (answers) {
                        res.status(200).json(answers);
                    })

            },
            /// delete all answers from interview
            delete: (req, res) => {
                models.answer.destroy({
                        where: {
                            interview_id: req.params.id
                        }
                    }
                    )
                    .then(function (destroyed) {
                        res.status(204).json({});
                    })
            }
        }),

    ]
);
