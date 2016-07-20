"use strict";
var express = require('express');
var app = express();
var Resource = require('./lib/Resource');
var models = require('./models');
var bodyParser  = require('body-parser');
var jwt = require('jsonwebtoken');
const secret = 'tg6bhr5dxddrtcx';

app.use(bodyParser.json());
app.use((req, res, next) => {
    var token = req.get('token');
    if (token) {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.status(403).json({
                    'success': false,
                    'msg': "Invalid token (perhaps expired).",
                    'error' : err
                });
            } else {
                req.user = decoded.user;
                next();
            }
        });
    } else {
        req.auth = false;
        req.user = undefined;
        next();
    }
});


var answer_routes = require('./routes/answer');
var role_routes = require('./routes/role');
var interview_routes = require('./routes/interview');
var question_routes = require('./routes/question');
var user_routes = require('./routes/user');
var tag_routes = require('./routes/tag');
var position_routes = require('./routes/position');
var candidate_routes = require('./routes/candidate');
var interviewer_routes = require('./routes/interviewer');

question_routes.register(app,'');
interview_routes.register(app,'');
answer_routes.register(app,'');
user_routes.register(app,'');
role_routes.register(app,'');
tag_routes.register(app,'');
position_routes.register(app,'');
candidate_routes.register(app, '');
interviewer_routes.register(app, '');

app.use('/static', express.static('../static'));


// middleware to add headers for cross origin requests

app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});


//var testq = require('./testData');

module.exports = app;
