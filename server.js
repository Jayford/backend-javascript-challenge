"use strict";
const http = require('http');
const app = require('./app');

const port = derivePort(process.env.PORT || '8080');
const ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.set('port', port);

const server = http.createServer(app);

server.listen(port, ip_address);
server.on('error', onError);
server.on('listening', onListening);

/** Derive port number **/
function derivePort(val) {
  const port = parseInt(val, 10);
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
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port;
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

