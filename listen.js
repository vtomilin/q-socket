var Q = require('q'),
    net = require('net');

module.exports = listen;

/**
 * Returns a promise object, which will be notified with 'progress' handler
 * invoked (with resulting socket) every time a connection is made to the
 * underlying port.
 *
 * @param {Number} [args.port]
 * @param {String} [args.host]
 * @param {Number} [args.backlog]
 * @param {String} [args.path]
 * @param {Object} [args.handle]
 * @param {Object} [args.options]
 *
 * @returns {Object}
 * @exception is thrown if none of the required properties is set on args
 * argument.
 */
function listen(args) {
    var d = Q.defer(),
        server = net.createServer((args && args.options) || {},
                                  d.notify.bind(d)),
        rejected = false,
        listenArgs = [];

    server.on("error", function(error) {
        rejected = true;
        d.reject(error);
    });
    server.on("close", function() {
        if(!rejected) {
            d.resolve();
        }
    });

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
        throw "Expected at least to find 'port', 'path', or 'handle' in " +
              "'args' argument";
    }

    server.listen.apply(server, listenArgs);

    return d.promise;
}
