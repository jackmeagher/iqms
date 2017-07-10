/**
 * Created by hunterheidenreich on 8/16/16.
 */
var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};
var firebase = require('firebase');
var nodemailer = require('nodemailer');

exports = module.exports = new Resource('email', '/email', {
        post: (req, res) => {
            if(req.query.idToken) {
                firebase.auth().verifyIdToken(req.query.idToken).then(function(decodedToken) {
                    var uid = decodedToken.sub;
                    console.log(req.body);
                }).catch(function(error) {
                    res.status(511).json({error: "Error"});
                });
            } else {
                res.status(401).json({error: "Forbidden"});
            }
        }
});
