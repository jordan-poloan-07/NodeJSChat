$(function() {

    var socket = io.connect('http://' + serverAddr + ':' + port);

    var field = $("input.field");
    var sendButton = $("input.send");
    var content = $("div#content");

    var username = promptForUsername();

    socket.on('message', function(data) {
        if (data.message) {
            content.append("<div><span>" + data.username + " : </span><span>" + data.message + "</span></div>");
            content[0].scrollTop = content[0].scrollHeight
        } else {
            console.log("There is a problem:", data);
        }
    });

    field.keypress(function(e) {
        if (e.which === 13) {
            sendMessage();
        }
    });

    sendButton.click(sendMessage);

    function sendMessage() {
        socket.emit('send', {
            username: username,
            message: field.val()
        });
        field.val("");
    }

    function promptForUsername() {
        var username = window.prompt("Enter your username", "anonymous");
        return (!username) ? "anonymous" : username;
    }

});
