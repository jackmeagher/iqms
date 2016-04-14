/**
 * Created by nick on 3/15/16.
 */
var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};


exports = module.exports = new Resource('question', '/question', {
        // get all questions
        get: (req, res) => {
            var query_doc = {};
            if (req.query.difficulty) {
                query_doc.difficulty = req.query.difficulty;
            }
            if (req.query.target_text) {
                query_doc.question_text = {like: "%" + req.query.target_text + "%"};
                console.log(query_doc.question_text);
            }

            models.question.findAll({where: query_doc}
            ).then(function (questions) {
                res.status(200).json({
                    questions: questions
                });
            })
        },
        // create new question
        post: (req, res) => { // make a new question
            if (!req.body.question_text){
                req.body.question_text = 'DEFAULT VAL';
            }
            if(!req.body.difficulty){
                req.body.difficulty = -1;
            }
            models.question.create({
              question_text: req.body.question_text ? req.body.question_text : null,
              difficulty: req.body.difficulty ? req.body.difficulty : null
              // previous
              // question_text: req.body.question_text,
              // difficulty: req.body.difficulty
            }).then(function (created) {
                res.status(201).json({
                    question: created.dataValues
                });
            })
        },


    }, [new Resource('get_question_by_id', '/:id', {
        //get question by id
        get: (req, res) => {
            models.question.findAll({
                    where: {
                        id: req.params.id
                    }
                })
                .then(function (question) {
                    res.status(200).json({
                        question: question[0]
                    });
                })
        },
        //delete question by id
        delete: (req, res) => {
            models.question.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                .then(function (destroyed) {
                    res.status(204).json({});
                })


        }
    }
    ),
    new Resource('add tag to question', '/:id/tags/:tag_id', {
        post: (req, res) => {

            models.question.findOne({
                where: {
                    id: req.params.id
                }
            }).then(function (question) {
                models.tag.findOne(
                    {
                        where: {
                            id: req.params.tag_id
                        }
                    }).then(function (tag) {
                    question.addTag(tag).then(
                        function (added) {
                            res.status(200).json({
                                added: added
                            });
                        }
                    )

                })
            })
        }
    } ),
        new Resource('get tags by question', '/:id/tags/', {
            get: (req, res) => {
                models.question.findOne({where:{
                    id:req.params.id
                }}).then(function(question){

                        question.getTags().then(function(tags){
                            res.status(200).json(
                                {
                                    tags: tags
                                }
                            )}
                        )
                    }
                )

            }
        } )
]
);
