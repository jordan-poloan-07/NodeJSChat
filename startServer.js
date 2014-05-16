// node arguments 
var args = process.argv.slice(2);
var SERVER = args[0] || "localhost"; // 
var PORT = args[1] || 3700; // verify if 4 digit number 

// server global variables
var serverGlobals = {
    activeUsers: {}
};

// requirements
var express = require("express");
var jade = require("jade");
var socketIO = require("socket.io");

// server initialization
var server = express();
server.set('views', __dirname + '/templates');
server.set('view engine', 'jade');
server.engine('jade', jade.__express);
server.use(express.static(__dirname + '/public'));

server.get("/", function(req, res) {
    res.render("index", {
        serverAddr: SERVER,
        port: PORT
    });
});

var serverSocket = socketIO.listen(server.listen(PORT));

serverSocket.sockets.on('connection', function(socket) {

    // add socket id
    serverGlobals.activeUsers[socket.id] = 0;

    // emit welcome message to client
    socket.emit('welcome', {
        message: 'Welcome to NodeJSChat'
    });

    // callback for receiving messages from client
    socket.on('send', function(data) {
        serverSocket.sockets.emit('message', data);
    });

    // get the user info
    socket.on('userinfo', function(info) {
        serverGlobals.activeUsers[socket.id] = info.username;
    });

    socket.on('getActiveUsers', function() {
        socket.emit("activeUsersList", {
            activeUsers: serverGlobals.activeUsers
        });
    });

    socket.on('privateMsg', function(data) {
        serverSocket.sockets.socket(data.socketId).emit('message', {
            username: data.username,
            message: data.message
        });
    });

    // in case of disconnection
    socket.on('disconnect', function() {
        delete serverGlobals.activeUsers[socket.id];
    });

    setInterval(function() {
        socket.emit('activeUsers', {
            activeUsers: Object.keys(serverGlobals.activeUsers).length
        });
    }, 1000);

});

console.log("Established server : " + SERVER + " in port " + PORT);
