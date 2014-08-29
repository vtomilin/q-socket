module.exports = function(socket) {
    var closedFuture = require('q').defer(),
        port = {
            postMessage: function(message) {
                socket.write(message);
            },
            onmessage: null,
            closed: closedFuture.promise
        },
        error;

    socket.on("error", function(err) {
        error = err;
    });
    socket.on("close", function(hadError) {
        closedFuture.resolve(error);
    });
    socket.on("data", function(data) {
        port.onmessage({data: data.toString()});
    });

    return port;
};