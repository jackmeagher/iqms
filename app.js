"use strict";
var express = require('express');
var app = express();
var Resource = require('./lib/Resource');
var models = require('./models');
var routes = require('./routes');

routes.hw_resource.register(app, '');
routes.question.register(app,'');
routes.interview.register(app,'');
routes.user.register(app,'');

module.exports = app;
