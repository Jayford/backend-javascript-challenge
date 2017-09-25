"use strict";
var http = require('http');
var app = require('./app');

var port = derivePort(process.env.PORT || '8080');
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.set('port', port);

var server = http.createServer(app);

server.listen(port, ip_address);
server.on('error', onError);
server.on('listening', onListening);

/** Derive port number **/
function derivePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

/** Event listener for HTTP server "listening" event **/

function onListening() {
  var address = server.address();
  var bind = typeof address === 'string' ? 'pipe ' + address  : 'port ' + address.port; 
  console.log('Listening on ' + bind);
}

/** Event listener for HTTP server "error" event **/

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

