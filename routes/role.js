/**
 * Created by nick on 3/15/16.
 */
var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};



exports = module.exports = new Resource('role', '/role', {
        get: (req, res) => {

            //models.sequelize.query('SELECT * FROM "Users";')
            models.role.findAll()
                .then(function(role) {
                    res.status(200).json({
                        role : role
                    });
                })
        },
        post: (req, res) => { // make a new question
            models.role.create({
                //TODO: user fields

            }).then(function(created) {
                res.status(200).json({
                    role: created.dataValues
                });
            })
        }



    }, [new Resource('get_role_by_id', '/:id', {
        get: (req, res) => { //get answer by id
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
        delete: (req, res) => {
            models.role.destroy({
                where: {
                    id: req.params.id
                }
            }).then(function(destroyed) {
                res.status(200).json({
                    role: destroyed.dataValues
                });
            });

        }




    }

    )]

);