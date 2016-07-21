var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};

exports = module.exports = new Resource('interviewer', '/interviewer', {
    get: (req, res) => {
        models.interviewer.findAll()
            .then(function(interviewers) {
                res.status(200).json({
                    interviewers: interviewers
                });
            })
    },
    post: (req, res) => { 
        if (!req.body.name){
            req.body.name = 'NAME';
        }
        
        models.interviewer.create({
            name : req.body.name ? req.body.name : null
        }).then(function(created) {
            res.status(201).json({
                data: created.dataValues
            });
        })
    }
}, [
    new Resource('access interviewer by id', '/:id', {
       get: (req, res) => {
            models.interviewer.findOne({
                where: {
                    id: req.params.id
                }
            }).then(function(result) {
                res.status(200).json({
                    result: result
                });
            })
       }
    }),
    new Resource('add tag to interviewer', '/:id/tag/:tag_name', {
        post: (req, res) => {
            models.interviewer.findOne({
                where: {
                    id: req.params.id
                }
            }).then(function(interviewer) {
                models.tag.findOne({
                    where: {
                        name: req.params.tag_name
                    }
                }).then(function(tag) {
                    interviewer.addTag(tag).then(function(added) {
                        res.status(200).json({
                           added: added 
                        });
                    })
                })
            })
        },
        delete: (req, res) => {
            models.interviewer.findOne({
                where: {
                    id: req.params.id
                }
            }).then(function(interviewer) {
                models.tag.findOne({
                    where: {
                        id: req.params.tag_name
                    }
                }).then(function(tag) {
                    position.removeTag(tag).then(function(removed) {
                        res.status(204).json({
                           removed: removed 
                        });
                    })
                })
            })
        }
    }),
    new Resource('get tags by interviewer', '/:id/tag', {
       get: (req, res) => {
            models.interviewer.findOne({
                where: {
                    id: req.params.id
                }
            }).then(function(interviewer) {
                interviewer.getTags().then(function(tags) {
                    res.status(200).json({
                        tags: tags
                    });
                })
            })
        },
        delete: (req, res) => {
            models.interviewer.findOne({
                where: {
                    id: req.params.id
                }
            }).then(function(interviewer) {
                interviewer.setTags([]).then(function(tags) {
                    res.status(204).json({});
                })
            })
        }
    })]
);
