/**
 * Created by nick on 3/15/16.
 */
var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};


exports = module.exports = new Resource('answer', '/answer', {
        // get all answers
        get: (req, res) => {
            models.answer.findAll()
                .then(function (answers) {
                    res.status(200).json({
                        answers: answers
                    });
                })
        },
        // create new answer
        post: (req, res) => {
            models.answer.create({
                answer_text: req.body.answer_text ? req.body.answer_text : null,
                rating: req.body.rating ? req.body.feedback : null,
                interviewId: req.body.interviewId ? req.body.interviewId : null,
                questionId: req.body.questionId ? req.body.questionId : null
            }).then(function (created) {
                res.status(201).json({
                    answer: created
                });
            })
        },

    put: (req, res) => {
        //console.log(req.body);
        models.answer.upsert(
          req.body.answer
        ).then(function (created) {
            res.status(201).json({
                answer: created
            });
        })
    }
    }, [new Resource('get_answer_by_id', '/:id', {
        // get answer by id
        get: (req, res) => {
            models.answer.findAll({
                    where: {
                        id: req.params.id
                    }
                })
                .then(function (answer) {
                    res.status(200).json({
                        answer: answer
                    });
                })
        },
        // delete answer by id
        delete: (req, res) => {
            models.answer.destroy({
                where: {
                    id: req.params.id
                }
            }).then(function (destroyed) {
                res.status(204).json({});
            });


        }
    }),new Resource('get_answer_by_ids', '/:id/:interview_id', {
        // get answer by id
        get: (req, res) => {
            models.answer.findOne({
                    where: {
                        interviewId: req.params.id,
                        questionId:req.params.interview_id
                    }
                })
                .then(function (answer) {
                    res.status(200).json({
                        answer: answer
                    });
                })
        }}),

        new Resource('get_unanswered_questions', '/interview/unanswered_questions/:interview_id', {
            get: (req, res) => {
                models.interview.findAll({
                    where: {
                        id: req.params.interview_id
                    }
                }).then(function (found) {
                    var answeredQuestions = [];
                    var unansweredQuestions = [];
                    var data = found[0];
                    //res.status(200).json(data);
                    data.getAnswers().then((answers) => {
                        answers.forEach((answer) => {
                            answer.getQuestion().then((question) => {
                                answeredQuestions.push(question);
                            });
                        });

                        data.getQuestions().then((questions) => {
                            questions.forEach((question) => {
                                var isAnswered = false;
                                for (var q of answeredQuestions) {
                                    if (q.id == question.id) {
                                        isAnswered = true;
                                    }
                                }
                                if (!isAnswered) {
                                    unansweredQuestions.push(question);
                                }
                            });

                            res.status(200).json({unansweredQuestions : unansweredQuestions});
                        });
                    });


                });

            }
        })]
);
