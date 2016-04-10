/**
 * Created by nick on 4/10/16.
 */

/**
 * Created by nick on 3/15/16.
 */

var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};



exports = module.exports = new Resource('tag', '/tag', {
        // get all users
        get: (req, res) => {

            //models.sequelize.query('SELECT * FROM "Users";')
            models.tag.findAll()
                .then(function(tags) {
                    res.status(200).json({
                        success: true,
                        tags: tags
                    });
                })
        },
        // create new user
        post: (req, res) => { // make a new question
            if (!req.body.label){
                req.body.label = 'DEFAULT VAL';
            }
            models.tag.create({
                label : req.body.label

            }).then(function(created) {
                res.status(201).json({
                    success: true,
                    data: created.dataValues
                });
            })
        }



    });
