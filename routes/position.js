var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};
var firebase = require('firebase');

exports = module.exports = new Resource('position', '/position', {
    get: (req, res) => {
        if(req.query.idToken) {
            firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                var uid = decodedToken.sub;
                models.position.findAll().then(function(positions) {
                    res.status(200).json({
                        positions: positions
                    });
                })
            }).catch(function(error) {
                res.status(511).json({error: "Error"});
            });
        } else {
            res.status(401).json({error: "Forbidden"});
        }
    },
    post: (req, res) => { // make a new position
        if(req.query.idToken) {
            firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                var uid = decodedToken.sub;
                models.position.create({
                    name : req.body.name ? req.body.name : null,
                    description: req.body.description ? req.body.description : null
                }).then(function(created) {
                    res.status(201).json({
                        data: created.dataValues
                    });
                })
            }).catch(function(error) {
                res.status(511).json({error: "Error"});
            });
        } else {
            res.status(401).json({error: "Forbidden"});
        }
        if (!req.body.name){
            req.body.name = 'Job';
        }

        if (!req.body.description) {
            req.body.description = 'Job description';
        }
    }
}, [new Resource('get position by id', '/:id', {
    get: (req, res) => {
        if(req.query.idToken) {
            firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                var uid = decodedToken.sub;
                models.position.findAll({
                    where: {
                        id: req.params.id
                    }
                }).then(function(position) {
                    res.status(200).json({
                        position: position[0]
                    });
                })
            }).catch(function(error) {
                res.status(511).json({error: "Error"});
            });
        } else {
            res.status(401).json({error: "Forbidden"});
        }
    }
}), new Resource('add candidate to position', '/:id/cadidates/:candidate_id', {
        post: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
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
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }
        },
        delete: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
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
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }
        }
    }), new Resource('get candidates by position', '/:id/candidates', {
        get: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
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
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }
        },
        delete: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.position.findOne({
                        where: {
                            id: req.params.id
                        }
                    }).then(function(position) {
                        position.setCandidates([]).then(function(candidates) {
                            res.status(204).json({});
                        })
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
