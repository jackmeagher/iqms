var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};

exports = module.exports = new Resource('tag', '/tag', {
        get: (req, res) => {
                var query = {};
                
                if (req.query.name) {
                    query.name = req.query.name;
                }
                
                models.tag.findAll({where: query}).
                        then(function(tags) {
                                res.status(200).json({tags: tags});
                })
        },
        post: (req, res) => {
                
                if (!req.query.name) {
                    req.query.name = 'Blank';
                }
                
                models.tag.create( {
                        name: req.body.name ? req.body.name : null
                }).then(function(created) {
                        res.status(201).json({tag: created.dataValues});
                })
        }



}, [new Resource('get_tag_by_id', '/:name', {
        get: (req, res) => {
            models.tag.find({
                    where: {
                        name: req.params.name
                    }
                })
                .then(function (tag) {
                    res.status(200).json({
                        tag: tag
                    });
                }) 
                
        },
        put: (req, res) => {
                models.tag.find({
                        where: {
                                name: req.params.name
                        }
                })
                .then(function (tag) {
                        tag.count = req.body.count;
                        tag.save({fields: ['count']}).then(function() {
                                res.status(200).json({tag: tag});
                        })
                })
        }
}),
    new Resource('get questions by tag', '/:name/questions/', {
        get: (req, res) => {
                models.tag.findOne({
                        where: {
                                name: req.params.name
                        }
                }).then(function(tag) {
                        tag.getQuestions().then ( function(questions) {
                                        res.status(200).json({
                                            questions: questions
                                        })
                                }
                        )
                })
        }
    })
    ]);