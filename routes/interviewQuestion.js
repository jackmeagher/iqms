var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};

exports = module.exports = new Resource('interviewQuestion', '/interviewQuestion', {
        get: (req, res) => {
                models.interviewQuestion.findAll().then(function (iq) {
                        res.status(200).json({
                            iq: iq
                        });
                    })
        }
    }, [new Resource('get with ids', '/:id/question/:qId', {
        //get question by id
        get: (req, res) => {
            models.interviewQuestion.find({
               where: {
                interviewId: req.params.id,
                questionId: req.params.qId
               }
             })
                .then(function (interviewQuestion) {
                    res.status(200).json({
                        interviewQuestion: interviewQuestion
                    });
                })
        }
    }
    ),
        new Resource('get with question id', '/:id', {
                get: (req, res) => {
                        models.interviewQuestion.find({
                                where: {
                                        questionId: req.params.id
                                }
                        }).then(function(result) {
                                res.status(200).json({
                                   result: result     
                                });
                        })
                }
        })
]
);
