#!/usr/bin/env node

/**
 * Module dependencies.
 */
const debug = require('debug')('src:server');
const http = require('http');
import "reflect-metadata";
import {createConnection} from "typeorm";
import dotenv from "dotenv";
import connectionOption from "../ormconfig";

const port = normalizePort(process.env.PORT || '3000');
dotenv.config();
if (typeof process.env.KEY1 == 'undefined') {
  console.error('Error: "KEY1" is not set.');
  console.error('Please consider adding a .env file with KEY1.');
  process.exit(1);
}


//connecting DB
createConnection(connectionOption).then(async connection => {
  const {default: app} = await import('../app');
  /**
   * Get port from environment and store in Express.
   */
  
  app.set('port', port);
  /**
   * Create HTTP server.
   */
  
  const server = http.createServer(app);
  /**
   * Listen on provided port, on all network interfaces.
   */
  
  server.listen(port);
  server.on('error', onError);
  // server.on('listening', onListening(server));
  server.on('listening', function(){console.log('Listening')});
}).catch(error => console.log(error));


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: any) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any): void {
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

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(server: any): void {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr?.port;
  debug('Listening on ' + bind);
}
