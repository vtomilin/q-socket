var Q = require('q'),
    net = require('net');

module.exports = connect;

/**
 * Returns a promise object, which is resolved with a socket on connection or
 * rejected with error.
 *
 * @param {Number} options.port
 * @param {String} [options.host]
 * @param {String} [options.localAddress]
 *
 * or
 *
 * @param {String} options.path
 *
 *
 * Common options:
 *
 * @param {Boolean} [allowHalfOpen]
 *
 * @returns {Object}
 */
function connect(options) {
    return Q.Promise(function(resolve, reject) {
        var socket = net.createConnection(options || {}, function() {
            socket.removeListener("error", reject);
            resolve(socket);
        });
        socket.once("error", reject);
    });
}
