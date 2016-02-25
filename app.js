"use strict";
var express = require('express');
var app = express();
var Resource = require('./lib/Resource');
var models = require('./models');
var routes = require('./routes');
var bodyParser  = require('body-parser');
var testq = require('./testData');

app.use(bodyParser.urlencoded()); // TODO: THIS IS DEPRECATED FIGURE OUT HOW TO FIX THAT

app.use(bodyParser.json());


// middleware to add headers for cross origin requests

app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});

routes.hw_resource.register(app, '');
routes.question.register(app,'');
routes.interview.register(app,'');
routes.answer.register(app,'');
routes.user.register(app,'');
routes.role.register(app,'');

module.exports = app;
