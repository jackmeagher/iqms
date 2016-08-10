"use strict";
var express = require('express');
var app = express();
var Resource = require('./lib/Resource');
var models = require('./models');
var bodyParser  = require('body-parser');
                   
var http           = require('http').createServer(app);
var io             = require('socket.io').listen(http);
var config = require('./config/config.json');
var firebase = require('firebase'); 
firebase.initializeApp({
    serviceAccount: config.development.firebaseServiceAccount,
    databaseURL: config.development.firebaseDatabaseURL
});

app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());


var answer_routes = require('./routes/answer');
var role_routes = require('./routes/role');
var interview_routes = require('./routes/interview');
var question_routes = require('./routes/question');
var user_routes = require('./routes/user');
var tag_routes = require('./routes/tag');
var position_routes = require('./routes/position');
var candidate_routes = require('./routes/candidate');
var interviewer_routes = require('./routes/interviewer');
var candidatePosition_routes = require('./routes/candidatePosition');
var interviewQuestion_routes = require('./routes/interviewQuestion');
var feedback_routes = require('./routes/feedback');

question_routes.register(app,'');
interview_routes.register(app,'');
answer_routes.register(app,'');
user_routes.register(app,'');
role_routes.register(app,'');
tag_routes.register(app,'');
position_routes.register(app,'');
candidate_routes.register(app, '');
interviewer_routes.register(app, '');
candidatePosition_routes.register(app, '');
interviewQuestion_routes.register(app, '');
feedback_routes.register(app, '');

app.use('/static', express.static('../static'));
app.use('/config', express.static('../config'))

// middleware to add headers for cross origin requests

app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});

module.exports = app;
