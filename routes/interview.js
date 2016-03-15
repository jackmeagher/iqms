/**
 * Created by nick on 3/15/16.
 */
var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};



exports = module.exports = new Resource('interview', '/interview', {
        get: (req, res) => {

            models.interview.findAll()
                .then(function(interviews) {
                    res.status(200).json({
                        interviews: interviews
                    });
                })
        },
        post: (req, res) => { // make a new interview
            models.interview.create({}).then(function(created) {
                res.status(200).json({
                    interview: created.dataValues
                });
            })
        },



    }, [new Resource('get_interview_by_id', '/:id', {
        get: (req, res) => { //get interview by id
            models.interview.findAll({
                where: {
                    id: req.params.id
                }
            }).then(function(interview) {
                res.status(200).json({
                    interview: interview[0]
                });
            })
        },



        delete: (req, res) => {
            models.interview.destroy({
                where: {
                    id: req.params.id
                }
            }).then(function(destroyed) {
                res.status(200).json({
                    answer: destroyed.dataValues
                });
            });

        }



    }), new Resource('get_interview_by_id', '/:id/questions', {
        get: (req, res) => { //get interview by id
            models.interview.findOne({
                    where: {
                        id: req.params.id
                    }
                })
                .then(function(interview) {
                    interview.getQuestions()
                        .then(function(questions) {
                            res.status(200).json(questions);
                        })
                })

        }




    }, [new Resource('add_question_to_interview', '/:question_id', {
        post: (req, res) => { // add question to interview
            models.interview.findOne({
                    where: {
                        id: req.params.id
                    }
                })
                .then(function(interview) {
                    models.question.findOne({
                            where: {
                                id: req.params.question_id
                            }
                        })
                        .then(function(question) {
                            interview.addQuestion(question)
                                .then(
                                    function(added) {
                                        res.status(200).json(added);
                                    })
                        })
                });

        },
        delete: (req, res) => { //remove question from interview
            models.interview.findOne({
                    where: {
                        id: req.params.id
                    }
                })
                .then(function(interview) {
                    models.question.findOne({
                            where: {
                                id: req.params.question_id
                            }
                        })
                        .then(function(question) {
                            interview.removeQuestion(question)
                                .then(
                                    function(removed) {
                                        res.status(200).json(removed);
                                    })
                        })
                });

        }



    })


    ]

    )]

);