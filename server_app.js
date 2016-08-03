var express = require('express');
var server_app = express();
var server = require('http').Server(server_app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    
    socket.on('question-feedback', function(data) {
        io.emit('notify-question-feedback' + data.interviewId, {
        });
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
       io.emit('notify-change-state' + data.interviewId, data); 
    });
  
});

server.listen(4041, "127.0.0.1", function() {
  console.log('Interview server up and running at 4041 port');
});