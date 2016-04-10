/**
 * Created by nick on 4/10/16.
 */


var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};



exports = module.exports = new Resource('position', '/position', {
    // get all users
    get: (req, res) => {

        //models.sequelize.query('SELECT * FROM "Users";')
        models.position.findAll()
            .then(function(positions) {
                res.status(200).json({
                    success: true,
                    positions: positions
                });
            })
    },
    // create new user
    post: (req, res) => { // make a new question
        if (!req.body.title){
            req.body.title = 'DEFAULT VAL';
        }
        models.position.create({
            title : req.body.title

        }).then(function(created) {
            res.status(201).json({
                success: true,
                data: created.dataValues
            });
        })
    }



});
