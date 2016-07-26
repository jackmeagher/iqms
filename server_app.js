var express = require('express');
var server_app = express();
var server = require('http').Server(server_app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  
  
  socket.on('question-feedback', function(data) {
    io.emit('notify-question-feedback', {
    });
  });
  
  socket.on('fake-question-feedback', function(data) {
    io.emit('notify-question-feedback', {
    });
  });
  
});

server.listen(4041, "127.0.0.1", function() {
  console.log('server up and running at 4041 port');
});