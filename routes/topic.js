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
        
        if (req.query.sub) {
            query_doc.sub = req.query.sub;
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
        
        if (!req.query.index) {
            req.query.index = 0;
        }
        
        if (!req.query.sub) {
            req.query.sub = [];
        }
        
        models.topic.create({
            type: req.body.type ? req.body.type : null,
            name: req.body.name ? req.body.name : null,
            sub: req.body.sub ? req.body.sub : null,
            index: req.body.index ? req.body.index : null
        }).then(function(created) {
            res.status(201).json({topic: created.dataValues});
        })
    }
    }, [new Resource('get_topic_by_id', '/:id', {
        get: (req, res) => {
            models.topic.findAll({
                    where: {
                        id: req.params.id
                    }
                })
                .then(function (topic) {
                    res.send("Test");
                    res.status(200).json({
                        topic: topic[0]
                    });
                })
        },
        put: (req, res) => {
            res.send('HERE');
            models.topic.find({
                    where: {
                        id: req.params.id
                    }
                })
                .then(function (topic) {
                    topic.sub = req.body.sub;
                    topic.save({fields: ['sub']}).then(function() {
                        res.status(200);
                    })
                })
                .catch(function(err) {
                    res.send("catch");
                    res.send(err);
                })
        }
    })]
    
);