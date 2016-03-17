"use strict";
var express = require('express');
var app = express();
var Resource = require('./lib/Resource');
var models = require('./models');


var answer_routes = require('./routes/answer');
var role_routes = require('./routes/role');
var interview_routes = require('./routes/interview');
var question_routes = require('./routes/question');
var user_routes = require('./routes/user');

question_routes.register(app,'');
interview_routes.register(app,'');
answer_routes.register(app,'');
user_routes.register(app,'');
role_routes.register(app,'');


var bodyParser  = require('body-parser');
var testq = require('./testData');

app.use(bodyParser.urlencoded()); // TODO: THIS IS DEPRECATED FIGURE OUT HOW TO FIX THAT

app.use(bodyParser.json());
app.use('/static', express.static('../static'));


// middleware to add headers for cross origin requests

app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});



module.exports = app;
