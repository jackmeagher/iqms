var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};

exports = module.exports = new Resource('tag', '/tag', {
        get: (req, res) => {
                var query = {};
                
                if (req.query.name) {
                    query.name = req.query.name;
                }
                
                if (req.query.count) {
                    query.count = req.query.count;
                }
                
                models.tag.findAll({where: query}).
                        then(function(tags) {
                                res.status(200).json({tags: tags});
                })
        },
        post: (req, res) => {
                if(!req.query.count) {
                        req.query.count = 0;
                }
                
                if (!req.query.name) {
                    req.query.name = 'Blank';
                }
                
                models.tag.create( {
                        count: req.body.count ? req.body.count : 0,
                        name: req.body.name ? req.body.name : null
                }).then(function(created) {
                        res.status(201).json({tag: created.dataValues});
                })
        }



}, [new Resource('get_tag_by_id', '/:id', {
        get: (req, res) => {
            models.tag.find({
                    where: {
                        id: req.params.id
                    }
                })
                .then(function (tag) {
                    res.status(200).json({
                        tag: tag
                    });
                }) 
                
        },
        put: (req, res) => {
                console.log("PUTTING");
                models.tag.find({
                        where: {
                                id: req.params.id
                        }
                })
                .then(function (tag) {
                        tag.count = req.body.count;
                        tag.save({fields: ['count']}).then(function() {
                                res.status(200).json({tag: tag});
                                console.log("DONE");
                        })
                })
        }
})
    ]);