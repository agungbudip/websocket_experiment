var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000, function () {
    console.log("server running on port 3000");
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    console.log('user connected ' + socket.id);
    socket.on('set_message', function (data) {
        console.log('set_message : ' + data);
        io.sockets.emit('new_message', data);
    });
});
