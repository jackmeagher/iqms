/**
 * Created by nick on 3/15/16.
 */
var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};



exports = module.exports = new Resource('role', '/role', {
        // get all roles
        get: (req, res) => {

            models.role.findAll()
                .then(function(role) {
                    res.status(200).json({
                        role : role
                    });
                })
        },
        // make new role
        post: (req, res) => {
            models.role.create({
                //TODO: user fields

            }).then(function(created) {
                res.status(201).json({
                    role: created.dataValues
                });
            })
        }



    }, [new Resource('get_role_by_id', '/:id', {
        // get answer by id
        get: (req, res) => {
            models.role.findAll({
                where: {
                    id: req.params.id
                }
            }).then(function(role) {
                res.status(200).json({
                    role: role
                });
            })
        },
        // delete answer by id
        delete: (req, res) => {
            models.role.destroy({
                where: {
                    id: req.params.id
                }
            }).then(function(destroyed) {
                res.status(204).json({
                    //role: destroyed.dataValues
                });
            });

        }




    }

    )]

);