"use strict";
var express = require('express');
var app = express();
var Resource = require('./lib/Resource');
var models = require('./models');
var bodyParser  = require('body-parser');

app.use(bodyParser.json());



var answer_routes = require('./routes/answer');
var role_routes = require('./routes/role');
var interview_routes = require('./routes/interview');
var question_routes = require('./routes/question');
var user_routes = require('./routes/user');
var tag_routes = require('./routes/tag');


question_routes.register(app,'');
interview_routes.register(app,'');
answer_routes.register(app,'');
user_routes.register(app,'');
role_routes.register(app,'');
tag_routes.register(app,'');



app.use('/static', express.static('../static'));


// middleware to add headers for cross origin requests

app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});



var testq = require('./testData');

module.exports = app;
