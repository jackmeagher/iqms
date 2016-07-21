var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};

exports = module.exports = new Resource('candidatePosition', '/candidatePosition', {
        get: (req, res) => {
                models.candidatePosition.findAll().then(function (cp) {
                        res.status(200).json({
                            cp: cp
                        });
                    })
        }
    }, [new Resource('get with ids', '/:id/position/:posId', {
        //get question by id
        get: (req, res) => {
            models.candidatePosition.find({
               where: {
                candidateId: req.params.id,
                positionId: req.params.posId
               }
             })
                .then(function (candidatePosition) {
                    res.status(200).json({
                        candidatePosition: candidatePosition
                    });
                })
        }
    }
    )
]
);
