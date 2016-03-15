/**
 * Created by nick on 3/15/16.
 */
var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};



exports = module.exports = new Resource('answer', '/answer', {
        get: (req, res) => {
            models.answer.findAll()
                .then(function(answers) {
                    res.status(200).json({
                        answers: answers
                    });
                })
        },
        post: (req, res) => { // make a new question
            models.answer.create({
                feeedback: req.body.feedback, // SHOCKLEY : <input type="text", name="question_text">
                rating: req.body.rating //            <input type="number" name="difficulty">
            }).then(function(created) {
                res.status(200).json({
                    answer: created.dataValues
                });
            })
        },



    }, [new Resource('get_answer_by_id', '/:id', {
        get: (req, res) => { //get answer by id
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