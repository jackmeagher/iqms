var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};

exports = module.exports = new Resource('position', '/position', {
    get: (req, res) => {
        models.position.findAll()
            .then(function(positions) {
                res.status(200).json({
                    positions: positions
                });
            })
    },
    post: (req, res) => { // make a new position
        if (!req.body.name){
            req.body.name = 'Job';
        }
        models.position.create({
            name : req.body.name ? req.body.name : null
        }).then(function(created) {
            res.status(201).json({
                data: created.dataValues
            });
        })
    }
}, [new Resource('get position by id', '/:id', {
    get: (req, res) => {
        models.position.findAll({
            where: {
                id: req.params.id
            }
        }).then(function(position) {
            res.status(200).json({
                position: position[0]
            });
        })
    }
    
}),
    new Resource('add candidate to position', '/:id/cadidates/:candidate_id', {
        post: (req, res) => {
            models.position.findOne({
                where: {
                    id: req.params.id
                }
            }).then(function(position) {
                models.cadidate.findOne({
                    where: {
                        id: req.params.candidate_id
                    }
                }).then(function(candiate) {
                    position.addCandidate(candidate).then(function(added) {
                        res.status(200).json({
                           added: added 
                        });
                    })
                })
            })
        },
        delete: (req, res) => {
            models.position.findOne({
                where: {
                    id: req.params.id
                }
            }).then(function(position) {
                models.cadidate.findOne({
                    where: {
                        id: req.params.candidate_id
                    }
                }).then(function(candiate) {
                    position.removeCandidate(candidate).then(function(removed) {
                        res.status(204).json({
                           removed: removed 
                        });
                    })
                })
            })
        }
    }),
    new Resource('get candidates by position', '/:id/candidates', {
       get: (req, res) => {
            models.positon.findOne({
                where: {
                    id: req.params.id
                }
            }).then(function(position) {
                position.getCandidates().then(function(candidates) {
                    res.status(200).json({
                        candidates: candidates
                    });
                })
            })
        },
        delete: (req, res) => {
            models.position.findOne({
                where: {
                    id: req.params.id
                }
            }).then(function(position) {
                position.setCandidates([]).then(function(candidates) {
                    res.status(204).json({});
                })
            })
        }
    })]
);
