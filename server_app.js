var express = require('express');
var server_app = express();
var server = require('http').Server(server_app);
var io = require('socket.io')(server);
var config = require('./config/config.json');

server_app.set('web_socket_host', config.development.webSocketHost || '127.0.0.1');
server_app.set('web_socket_port', config.development.webSocketPort || 4041);

io.on('connection', function (socket) {

    var interviewStates = {};

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
        data.message = "Filter updated.";
        io.emit('notify-update-filter' + data.id, data);
    });
    
    socket.on('change-state', function(data) {
        interviewStates[data.interviewId] += data.state;
        data.state = interviewStates[data.interviewId];
        io.emit('notify-change-state' + data.interviewId, data);
    });

    socket.on('request-interview', function(data) {
        if(!interviewStates[data.id]) {
            interviewStates[data.id] = 0;
        }
        io.emit('notify-request-interview' + data.id, data);
    });

    socket.on('broadcast-interview', function(data) {
        data.state = interviewStates[data.id];
        io.emit("notify-broadcast-interview" + data.id, data);
    });

    socket.on('inline', function(data) {
       io.emit('notify-inline' + data.id, data.question);
    });
  
});

server.listen(server_app.get('web_socket_port'), server_app.get('web_socket_host'), function() {
  console.log('Interview server up and running at ' + server.address().port);
});