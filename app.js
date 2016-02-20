"use strict";
var express = require('express');
var app = express();
var Resource = require('./lib/Resource');
var models = require('./models');
var routes = require('./routes');

// middleware to add headers for cross origin requests

app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});

routes.hw_resource.register(app, '');
routes.question.register(app,'');
routes.interview.register(app,'');

module.exports = app;
