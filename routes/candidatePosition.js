var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};
var firebase = require('firebase');

exports = module.exports = new Resource('candidatePosition', '/candidatePosition', {
        get: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.candidatePosition.findAll().then(function (cp) {
                        res.status(200).json({
                            cp: cp
                        });
                    })
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }
        }
    }, [new Resource('get with ids', '/:id/position/:posId', {
        get: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.candidatePosition.find({
                        where: {
                            candidateId: req.params.id,
                            positionId: req.params.posId
                        }
                    }).then(function (candidatePosition) {
                        res.status(200).json({
                                candidatePosition: candidatePosition
                        });
                    })
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }
        }
    }), new Resource('get with one id', '/:id', {
        get: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.candidatePosition.find({
                        where: {
                            c_id: req.params.id
                        }
                    }).then(function(result) {
                        res.status(200).json({
                            result: result
                        });
                    })
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }
        }
    })
]);
