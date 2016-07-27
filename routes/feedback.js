var models = require('../models');
var Resource = require('../lib/Resource');
var exports = model.exports = {};

exports = module.exports = new Resource('feedback', '/feedback', {
    get: (req, res) => {
        models.feedback.findAll()
        .then(function(feedbacks) {
          res.status(200).json({
            feedbacks: feedbacks
          });
        })
    },
    post: (req, res) => {
        
        var data = {};
        data[req.body.user] = {
            rating: req.body.rating ? req.body.rating : null,
            note: req.body.note ? req.body.note : null
        };
        
        models.feedback.create({
            question_id: req.body.question_id ? req.body.question_id : null,
            data: data
        }).then(function(created) {
            res.status(201).json({
               feedback: created.dataValues 
            });
        })
    }
}, [new Resource('get_feedback_by_id', '/:id', {
    get: (req, res) => {
        models.feedback.findAll({
            where: {
                id: req.params.id
            }
        }).then(function(feedback) {
            res.status(200).json({
               feedback: feedback[0] 
            });
        })
    },
    
    put: (req, res) => {
        models.feedback.find({
            where: {
                id: req.params.id
            }
        })
        .then(function(feedback) {
            feedback.data[req.body.user] = {
                rating: req.body.rating ? req.body.rating : null,
                note: req.body.note ? req.body.note : null
            };
            feedback.save({fields: ['data']}).then(function(feedback) {
                res.status(201).json({feedback: feedback});
            })
        })
    }
})
    
]);