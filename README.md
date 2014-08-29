#Q-Socket

_Q-Socket_ makes using Node sockets under [q](http://documentup.com/kriskowal/q/)
and [q-connection](https://github.com/kriskowal/q-connection) easier by providing the following functions:

##listen(args)
Returns a promise object, which will be notified with 'progress' handler
invoked (with the accepted socket) every time a connection is made to the
underlying port.

###Arguments
`args` is an object, specifying the following properties:

_TCP sockets_
* `args.port` numerical port number
* `args.host` optional host, defaults to localhost
* `args.backlog` optional depth of accept queue

_UNIX sockets_
* `args.path` UNIX socket path string

_or_
* `args.handle` the `handle`object can be set to either a server or socket (anything with an underlying _handle member), or a {fd: <n>} object

_common properties_
* `args.options` optional object, set up as per [net.createServer](http://nodejs.org/api/net.html#net_net_createserver_options_connectionlistener)

###Example
Below is a simple 'time' server, which also happens to demonstrate a use of
`portify` function, further described below.

```javascript
var qConnection = require('q-connection'),
    Qs = require('q-socket'),
    util = require('util'),
    service = function() { return Date.now() };

function raddr(socket) {
    return (socket && socket.remoteAddress && socket.remotePort &&
            util.format('%s:%d', socket.remoteAddress, socket.remotePort))
            || '';
}

Qs.listen({port: 9999, host: "127.0.0.1"}).progress(function(socket) {
    var port = Qs.portify(socket),
        peer = raddr(socket);

    console.log('Accepted connection:', peer);
    qConnection(port, service);

    socket.on('close', function() {
        console.log('Client disconnected:', peer);
    });

}).done(function() {
    console.log('Done.');
});

```

##connect(options)
Returns a promise object, which is resolved with a socket on connection or
rejected with error.

###Arguments
`options` object is a single argument to `connect(options)` function, which may specify the following properties:

_TCP sockets_
* `options.port` required port number
* `options.host` optional host. If not specified, uses local host by default.
* `options.localAddress` optional local interface for the connection.

_UNIX sockets_
* `options.path` UNIX socket path string

_common options_
* `allowHalfOpen` boolean argument, detailed in [net.connect](http://nodejs.org/api/net.html#net_net_connect_options_connectionlistener)

 ###Example
 This is a client to the simple 'time' server above.
 ```javascript
var qConnection = require('q-connection'),
    Qs = require('q-socket');

Qs.connect({host: '127.0.0.1', port: 9999}).then(function(socket) {
    var service = qConnection(Qs.portify(socket));

    service.fcall().done(function(data) {
        console.log('Response:', new Date(data));
        socket.end();
    });
});
 ```

##portify(socket)
Makes a `q-connection` compatible port out of given [socket](http://nodejs.org/api/net.html#net_class_net_socket) object and returns it.

###Example
See above client and server samples for examples of `portify` use.
