var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};

exports = module.exports = new Resource('question', '/question', {
        get: (req, res) => {
            var query_doc = {};
            if (req.query.difficulty) {
                query_doc.difficulty = req.query.difficulty;
            }
            if (req.query.target_text) {
                query_doc.text = {like: "%" + req.query.text + "%"};
            }

            models.question.findAll({where: query_doc}
            ).then(function (questions) {
                res.status(200).json({
                    questions: questions
                });
            })
        },
        post: (req, res) => {
            if (!req.body.text){
                req.body.text = 'Blank Text';
            }
            
            if (!req.body.tech) {
                req.body.tech = true;
            }
            
            if(!req.body.difficulty){
                req.body.difficulty = 0;
            }
            
            if (!req.body.answers) {
                req.body.answers = [];
            }
            
            models.question.create({
                text: req.body.text ? req.body.text : null,
                tech: req.body.tech ? req.body.tech : null,
                difficulty: req.body.difficulty ? req.body.difficulty : 0,
                answers: req.body.answers ? req.body.answers : null
            }).then(function (created) {
                res.status(201).json({
                    question: created.dataValues
                });
            })
        },

        put: (req, res) => {
        models.question.upsert(req.body.question).then(function (created) {
                  res.status(201).json({question:created});      
                })
        }

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


        },
        put: (req, res) => {
             models.question.find({
               where: {
                id: req.params.id
               }
             })
             .then(function (question) {
                question.text = req.body.text;
                question.tech = req.body.tech;
                question.difficulty = req.body.difficulty;
                question.answers = req.body.answers;
                question.save({fields: ['text', 'tech', 'difficulty', 'answers']}).then(function() {
                     res.status(200).json({});   
                })
                
             })
                
        }
    }
    ),
        new Resource('add tag to question', '/:id/tags/:tag_name', {
            post: (req, res) => {
                models.question.findOne({
                    where: {
                        id: req.params.id
                    }
                }).then(function (question) {
                    models.tag.findOne(
                        {
                            where: {
                                name: req.params.tag_name
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
            },
            delete: (req, res) => {
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
                                        console.log('REMOVED');
                                                res.status(204).json({});
                                        }
                                )
                        })
                })
            }
        } ),
        new Resource('get tags by question', '/:id/tags/', {
                get: (req, res) => {
                    models.question.findOne({where:{
                        id: req.params.id
                    }}).then(function(question) {
                            question.getTags().then(function(tags){
                                res.status(200).json({
                                        tags: tags
                                    }
                                )}
                            )
                        })
                },
                delete: (req, res) => {
                        models.question.findOne({where: {
                                id: req.params.id
                        }}).then(function (question) {
                                question.setTags([]).then(function(tags) {
                                        res.status(204).json({});
                                })
                        })
                }
        })
]
);
