// node arguments 
var args = process.argv.slice(2);
var SERVER = args[0] || "localhost"; // 
var PORT = args[1] || 3700; // verify if 4 digit number 

// server global variables
var serverGlobals = {
    activeUsers: 0
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
    // increment activeUsers 
    serverGlobals.activeUsers += 1;
    // emit welcome message to client
    socket.emit('message', {
        username: 'Server',
        message: 'Welcome to the chat'
    });
    // callback for receiving messages from client
    socket.on('send', function(data) {
        serverSocket.sockets.emit('message', data);
    });
    // callback client's request for active user count updates
    socket.on('requestActiveUsersCount', function() {
        socket.emit('activeUsers', {
            activeUsers: serverGlobals.activeUsers
        });
    });
    // in case of disconnection
    socket.on('disconnect', function() {
        serverGlobals.activeUsers -= 1;
    });
});

console.log("Established server : " + SERVER + " in port " + PORT);
