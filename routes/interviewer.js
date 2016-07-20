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
}
);
