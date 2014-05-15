// node arguments 
var args = process.argv.slice(2);
var serverAddr = args[0] || "localhost"; // 
var port = args[1] || 3700; // verify if 4 digit number 

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
        serverAddr: serverAddr,
        port: port
    });
});

var serverSocket = socketIO.listen(server.listen(port));

serverSocket.sockets.on('connection', function(socket) {
    socket.emit('message', {
        username: "Server",
        message: 'welcome to the chat'
    });
    socket.on('send', function(data) {
        serverSocket.sockets.emit('message', data);
    });
});

console.log("Established server in port " + port);
