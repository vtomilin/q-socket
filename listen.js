var Q = require('q'),
    net = require('net');

module.exports = listen;

/**
 * Returns a promise object, to be fulfilled when underlying server 
 * object gets gracefully closed; or rejected, if the server object generates
 * an "error" event; or if unsufficient arguments were given.
 *
 * "onconnected" callback will be invoked with resulting socket object every 
 * time a connection is made to the underlying server object.
 *
 * @param {Number} [args.port]
 * @param {String} [args.host]
 * @param {Number} [args.backlog]
 * @param {String} [args.path]
 * @param {Object} [args.handle]
 * @param {Object} [args.options]
 *
 * @param {Function} onconnected.
 *
 * @returns {Object}
 */
function listen(args, onconnected) {
    var d = Q.defer(),
        server,
        rejected = false,
        listenArgs = [];


    if(args.port) {
        listenArgs.push(Number(args.port));
        if(args.host) {
            listenArgs.push(args.host);
        }
        if(args.backlog) {
            listenArgs.push(Number(args.backlog));
        }
    } else if(args.path) {
        listenArgs.push(args.path);
    } else if(args.handle) {
        listenArgs.push(args.handle);
    } else {
        d.reject("Expected at least to find 'port', 'path', or 'handle' in " +
                 "'args' argument");
        return d.promise;
    }

    server = net.createServer((args && args.options) || {}, function(socket) {
        if(typeof onconnected === 'function') {
            onconnected(socket);
        }
    });

    server.on("error", function(error) {
        rejected = true;
        d.reject(error);
    });
    server.on("close", function() {
        if(!rejected) {
            d.resolve();
        }
    });

    server.listen.apply(server, listenArgs);

    return d.promise;
}
