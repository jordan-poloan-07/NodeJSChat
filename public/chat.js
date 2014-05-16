$(function() {

    var socket = io.connect('http://' + serverAddr + ':' + port);

    var userCount = $('#userCount');
    var content = $('#content');
    var field = $('input.field');
    var sendButton = $('input.send');
    var getActiveUsersButton = $('input.get-users');

    var username = promptForUsername();

    // get welcome message
    socket.on('welcome', function(data) {
        content.append("<div>" + data.message + "</div>")
        socket.emit("userinfo", {
            username: username
        });
    });

    // get messages
    socket.on('message', function(data) {
        if (data.message) {
            // differentiate between group messages and pms
            content.append("<div><span>" + data.username + " : </span><span>" + data.message + "</span></div>");
            content[0].scrollTop = content[0].scrollHeight;

        } else {
            console.log("There is a problem:", data);
        }
    });

    // get active users count
    socket.on('activeUsers', function(data) {
        userCount.text("Current Active Users : " + data.activeUsers);
    });

    // get active users list
    socket.on('activeUsersList', function(data) {
        console.log(data.activeUsers);
        // show a list
        // choose someone to pm
        // (dialog box appears)
        // press enter
        // sendPrivateMessage is called
        // server receives the privateMsg together with target socket id
        // server delivers the message
    });

    // send message using enter key
    field.keypress(function(e) {
        if (e.which === 13) {
            sendMessage();
        }
    });

    // send message using the button
    sendButton.click(sendMessage);

    // send a request to the server to get all active users
    getActiveUsersButton.click(getActiveUsers);

    function sendMessage() {
        socket.emit('send', {
            username: username,
            message: field.val().trim()
        });
        field.val("");
    }

    function getActiveUsers() {
        socket.emit("getActiveUsers");
    }

    function sendPrivateMessage(socketId, message) {
        socket.emit("privateMsg", {
            socketId: socketId,
            username: username,
            message: message
        });
    };

    function promptForUsername() {
        var username = window.prompt("Enter your username", "anonymous");
        return (!username) ? "anonymous" : username;
    }

});
