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
        get: (req, res) => {
            models.user.findAll().then(function(users) {
                res.status(200).json({
                        success: true,
                        users: users
                    });
                })
        },
        // create new user
        post: (req, res) => {
            models.user.create({
                name: req.body.name ? req.body.name : "NULL NAME",
                role: req.body.role ? req.body.role : "Interviewer"
            }).then(function(user) {
                res.status(201).json({
                    user: user.dataValues
                })
            })
        }
    }, [new Resource('get_user_by_id', '/:user_name', {
        // get user by id
        get: (req, res) => { //get answer by id
            models.user.find({
                where: {
                    name: req.params.user_name
                }
            }).then(function(user) {
                res.status(200).json({
                    user: user
                });
            })
        },
        put: (req, res) => {
            models.user.find({
                where: {
                    name: req.params.user_name
                }
            })
                .then(function (user) {
                    user.role = req.body.role;
                    user.save({fields: ['role']}).then(function() {
                        res.status(200).json({});
                    })

                })

        },
        // delete user by id
        delete: (req, res) => {
            models.user.destroy({
                where: {
                    name: req.params.user_name
                }
            }).then(function(destroyed) {
                res.status(204).json({
                });
            });

        }
    }),
    new Resource('get_interviews_by_user', '/:user_name/interviews', {
        get: (req, res) => {
            models.user.findOne({
                where: {
                    name: req.params.user_name
                }
            }).then(function(user) {
                user.getInterviews().then(function(interviews) {
                    res.status(200).json({
                       interviews: interviews
                    });
                })
            })
        }
    })
]);
