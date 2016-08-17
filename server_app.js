var express = require('express');
var server_app = express();
var server = require('http').Server(server_app);
var io = require('socket.io')(server);
var config = require('./config/config.json');

server_app.set('web_socket_host', config.development.webSocketHost || '127.0.0.1');
server_app.set('web_socket_port', config.development.webSocketPort || 4041);

var interviews = {};

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
        io.emit('notify-join' + data.id, interviews[data.id]);
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

server.listen(server_app.get('web_socket_port'), server_app.get('web_socket_host'), function() {
  console.log('Interview server up and running at ' + server.address().port);
});

