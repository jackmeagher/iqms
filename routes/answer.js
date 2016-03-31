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
                .then(function(answers) {
                    res.status(200).json({
                        answers: answers
                    });
                })
        },
        // create new answer
        post: (req, res) => {
            models.answer.create({
                //feedback: req.body.feedback,
                //rating: req.body.rating,
                //interview_id : req.body.interview_id,
                //question_id : req.body.question_id
            }).then(function(created) {
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
                .then(function(answer) {
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
            }).then(function(destroyed) {
                res.status(204).json({

                });
            });


        }


    }

    )]

);