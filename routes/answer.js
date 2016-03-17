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
                feeedback: req.body.feedback,
                rating: req.body.rating
            }).then(function(created) {
                res.status(200).json({
                    answer: created.dataValues
                });
            })
        },



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
                },
            }).then(function(destroyed) {
                res.status(200).json({
                    answer: destroyed.dataValues
                });
            });


        }


    }

    )]

);