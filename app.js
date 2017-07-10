"use strict";
var express = require('express');
var app = express();
var Resource = require('./lib/Resource');
var models = require('./models');
var bodyParser = require('body-parser');
var http = require('http')
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var config = require('./config/config.json');
var firebase = require('firebase');
firebase.initializeApp({
    serviceAccount: config.development.firebaseServiceAccount,
    databaseURL: config.development.firebaseDatabaseURL
});

app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json());

var interview_routes = require('./routes/interview');
var question_routes = require('./routes/question');
var user_routes = require('./routes/user');
var tag_routes = require('./routes/tag');
var position_routes = require('./routes/position');
var candidate_routes = require('./routes/candidate');
var candidatePosition_routes = require('./routes/candidatePosition');
var interviewQuestion_routes = require('./routes/interviewQuestion');
var feedback_routes = require('./routes/feedback');

question_routes.register(app, '');
interview_routes.register(app, '');
user_routes.register(app, '');
tag_routes.register(app, '');
position_routes.register(app, '');
candidate_routes.register(app, '');
candidatePosition_routes.register(app, '');
interviewQuestion_routes.register(app, '');
feedback_routes.register(app, '');

app.use('/', express.static('../static'));
app.use('/config', express.static('../config'))

// middleware to add headers for cross origin requests

app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});

io.on('connection', function (socket) {

    socket.on('join-interview', function(data) {
        if(!interviews[data.id]) {
            interviews[data.id] = {};
            interviews[data.id].state = 0;
            interviews[data.id].tags = [];
            interviews[data.id].orderBy = ['tags', 'difficulty'];
            interviews[data.id].difficulties = [{
                label: "Junior",
                checked: true
            }, {
                label: "Mid",
                checked: true
            }, {
                label: "Senior",
                checked: true
            }];
        }
        io.emit('notify-join-interview' + data.id, interviews[data.id]);
    });

    socket.on('add-tag', function(data) {
        var add = true;
        interviews[data.id].tags.forEach(function(tag) {
            if(data.tag.label == tag.label) {
                add = false;
            }
        });
        if(add) {
            interviews[data.id].tags.push(data.tag);
        }
        io.emit('notify-update-filter' + data.id, interviews[data.id]);
    });

    socket.on('update-tags', function(data) {
        interviews[data.id].tags[data.index].checked = !interviews[data.id].tags[data.index].checked;
        io.emit('notify-update-filter' + data.id, interviews[data.id]);
    });

    socket.on('update-all-tags', function(data) {
        interviews[data.id].tags.forEach(function(tag) {
           tag.checked = data.value;
        });

        io.emit('notify-update-filter' + data.id, interviews[data.id]);
    });

    socket.on('update-diff', function(data) {
        interviews[data.id].difficulties[data.index].checked = !interviews[data.id].difficulties[data.index].checked;
        io.emit('notify-update-filter' + data.id, interviews[data.id]);
    });

    socket.on('update-order', function(data) {
        interviews[data.id].orderBy = data.orderBy;
        io.emit('notify-update-filter' + data.id, interviews[data.id]);
    });

    socket.on('question-feedback', function(data) {
        io.emit('notify-question-feedback' + data.interviewId, data);
    });

    socket.on('question-reorder', function(data) {
        io.emit('notify-question-reorder' + data.interviewId, data);
    });

    socket.on('question-skip', function(data) {
        io.emit('notify-question-skip' + data.interviewId, {
            id: data.id,
            message: data.user + " skipped question."
        });
    });

    socket.on('update-filter', function(data) {
        interviews[data.id].message = "Filter updated";
        io.emit('notify-update-filter' + data.id, interviews[data.id]);
    });

    socket.on('change-state', function(data) {
        if(data.add)
            interviews[data.interviewId].state++;
        else
            interviews[data.interviewId].state--;
        io.emit('notify-change-state' + data.interviewId, interviews[data.interviewId]);
    });

    socket.on('request-interview', function(data) {
        io.emit('notify-request-interview' + data.id, interviews[data.id]);
    });

    socket.on('broadcast-interview', function(data) {
        data.state = interviews[data.id].state;
        io.emit("notify-broadcast-interview" + data.id, data);
    });

    socket.on('inline', function(data) {
       io.emit('notify-inline' + data.id, data.question);
    });

});


module.exports = app;
