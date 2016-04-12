/**
 * Created by nick on 3/15/16.
 */

var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};
const crypto = require('crypto');
var jwt = require('jsonwebtoken');

const secret = 'tg6bhr5dxddrtcx';



exports = module.exports = new Resource('user', '/user', {
        // get all users
        get: (req, res) => {

            //models.sequelize.query('SELECT * FROM "Users";')
            models.user.findAll()
                .then(function(users) {
                    res.status(200).json({
                        success: true,
                        users: users
                    });
                })
        },
        // create new user
        post: (req, res) => {
            crypto.randomBytes(16, function(err, buffer) {
                var salt = buffer.toString('hex');
                crypto.pbkdf2(req.body.password, salt, 100000, 255, 'sha512', function(err, key) {
                    if (err) throw err;
                    models.user.create({
                        first_name : req.body.first_name,
                        last_name : req.body.last_name,
                        email : req.body.email,
                        pw_hash : key.toString(),
                        salt : salt
                    }).then(function(created) {
                        res.status(201).json({
                            success: true,
                            data: created.dataValues
                        });
                    });
                });
            });
        }



    }, [new Resource('get_user_by_id', '/:id', {
        // get user by id
        get: (req, res) => { //get answer by id
            models.user.findAll({
                where: {
                    id: req.params.id
                }
            }).then(function(user) {
                res.status(200).json({
                    user: user
                });
            })
        },
        // delete user by id
        delete: (req, res) => {
            models.user.destroy({
                where: {
                    id: req.params.id
                },
                //truncate: true /* this will ignore where and truncate the table instead */
            }).then(function(destroyed) {
                res.status(204).json({
                });
            });

        }




    }),
        new Resource('user_interviews', '/:id/interviews/', {
                //TODO : make this work
                // get all interviews by user
                get: (req, res) => { //get answer by id
                    models.userInterview.findAll(
                        //where : {
                        //    //userId : req.params.id
                        //}
                    ).then(function(gotten_interviews) {
                        models.interview.findAll({
                            where: {
                                id : {in : gotten_interviews.dataValues.InterviewID}
                            }
                        }).then(function(ints){
                            res.status(200).json({
                                interviews: ints
                            })
                        });
                    })
                },
                // remove interview from user
                // TODO: does this work
                delete: (req, res) => {
                    models.user.destroy({
                        where: {
                            id: req.params.id
                        }
                        //,truncate: true /* this will ignore where and truncate the table instead */
                    }).then(function(destroyed) {
                        res.status(200).json({
                            answer: destroyed.dataValues
                        });
                    });

                }




            }

        ),
        new Resource('auth','/auth', {
            post : (req, res) => {
                models.user.findAll( {
                    where: {
                        id : req.body.user_id
                    }
                }).then( (data) => {
                    var user = data[0];
                    var salt = user.salt;
                    if (!req.body.password) {
                        res.status(403).json({
                            success: false,
                            msg: "Died here"
                        });
                    }
                    //req.body.password = String(req.body.password);
                    else {
                        crypto.pbkdf2(req.body.password, user.salt, 100000, 255, 'sha512', function (err, key) {
                            if (err) throw err;
                            var hash = key.toString();
                            if (hash == user.pw_hash) {
                                jwt.sign({user: user}, secret, {algorithm: 'HS256'}, function (token) {
                                    res.status(200).json({
                                        success: true,
                                        token: token
                                    })
                                })
                            } else {
                                res.status(403).json({
                                    success: false,
                                    msg: "Failed to auth."
                                })
                            }
                        });
                    }
                });
            }
        })]




);
