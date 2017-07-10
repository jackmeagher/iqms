var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};
var firebase = require('firebase');

exports = module.exports = new Resource('candidate', '/candidate', {
    get: (req, res) => {
        if(req.query.idToken) {
            firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                var uid = decodedToken.sub;
                models.candidate.findAll().then(function(candidates) {
                    res.status(200).json({
                        candidates: candidates
                    });
                })
            }).catch(function(error) {
                res.status(511).json({error: "Error"});
            });
        } else {
            res.status(401).json({error: "Forbidden"});
        }
    },
    post: (req, res) => {
        if(req.query.idToken) {
            firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                var uid = decodedToken.sub;
                if (!req.body.name){
                    req.body.name = 'NAME';
                }
                models.candidate.create({
                    name : req.body.name ? req.body.name : null
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
    }
}, [new Resource('get candidate by id', '/:id', {
    get: (req, res) => {
        if(req.query.idToken) {
            firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                var uid = decodedToken.sub;
                models.candidate.findAll({
                    where: {
                        id: req.params.id
                    }
                }).then(function(candidate) {
                    res.status(200).json({
                        candidate: candidate[0]
                    });
                })
            }).catch(function(error) {
                res.status(511).json({error: "Error"});
            });
        } else {
            res.status(401).json({error: "Forbidden"});
        }
    }
    
}), new Resource('add position to candidate', '/:id/position/:position_id', {
        post: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.candidate.findOne({
                        where: {
                            id: req.params.id
                        }
                    }).then(function(candidate) {
                        models.position.findOne({
                            where: {
                                id: req.params.position_id
                            }
                        }).then(function(position) {
                            candidate.addPosition(position).then(function(added) {
                                res.status(200).json({
                                    result: added
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
        get: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.candidate.findOne({
                        where: {
                            id: req.params.id
                        }
                    }).then(function(candidate) {
                        candidate.getPositions({ attributes: ['id'], joinTableAttributes: ['id']}).then(function(result) {
                            res.status(200).json({
                                result: result
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
                    models.candidate.findOne({
                        where: {
                            id: req.params.id
                        }
                    }).then(function(candidate) {
                        models.position.findOne({
                            where: {
                                id: req.params.position_id
                            }
                        }).then(function(position) {
                            candidate.removePosition(position).then(function(removed) {
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
    }), new Resource('get position by candidates', '/:id/position', {
       get: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    models.candidate.findOne({
                        where: {
                            id: req.params.id
                        }
                    }).then(function(candidate) {
                        candidate.getPositions().then(function(positions) {
                            res.status(200).json({
                                positions: positions
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
                    models.candidate.findOne({
                        where: {
                            id: req.params.id
                        }
                    }).then(function(position) {
                        candidate.setPositions([]).then(function(positions) {
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
