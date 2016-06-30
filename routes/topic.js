var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};

exports = module.exports = new Resource('topic', '/topic', {
    get: (req, res) => {
        var query_doc = {};
        
        if (req.query.type) {
            query_doc.type = req.query.type;
        }
        
        if (req.query.name) {
            query_doc.name = {like: "%" + req.query.name + "%"};
        }
        
        models.topic.findAll({where: query_doc}).
            then(function(topics) {
                res.status(200).json({topics: topics});
            })
    },
    post: (req, res) => {
        if (!req.query.type) {
            req.query.type = 'Blank Type';
        }
        
        if (!req.query.name) {
            req.query.name = 'Blank Name';
        }
        
        if (!req.query.subtopics) {
            req.query.subtopics = [];
        }
        
        models.topic.create({
            type: req.body.type ? req.body.type : null,
            name: req.body.name ? req.body.name : null,
            subtopics: req.body.subtopics ? req.body.subtopics : null
        }).then(function(created) {
            res.status(201).json({topic: created.dataValues});
        })
    },
});