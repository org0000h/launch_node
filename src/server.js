#!/usr/bin/env node
const server_config = require('./config_server');
const app = require('./app');

let server = null;
//  
if(server_config.tls_enable){
    const https = require('https');
    https.globalAgent.maxSockets = server_config.maxSockets;
    const fs = require('fs');
    //tls key and crt
    let privateKey  = fs.readFileSync(__dirname + '/../ecc_cert/ecc.key', 'utf8');
    let certificate = fs.readFileSync(__dirname + '/../ecc_cert/ecc.crt', 'utf8');
    let credentials = {key: privateKey, cert: certificate};
    server = https.createServer(credentials,app.callback());
}else{
    const http = require('http');
    http.globalAgent.maxSockets = server_config.maxSockets;
    server = http.createServer(app.callback());
}

if(server_config.websocket_enbale){
    const socket_io = require('socket.io');
    const webSocketService = require('./webSocketService');
    let io = socket_io(server);
    webSocketService(io);
}

 /**
   * Event listener for HTTP server "error" event.
   */
  function generateOnError(port){
    return  (error) => {
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
  }

let port = config_server.port;

let onError = generateOnError(port);
server.on('error', onError);
server.on('listening',()=>{
  console.log('listening on port:' + port);
});

if (server_config.db_enable) {
  const db = require('../persistence/db');
  require("../persistence/loadModels");
  db.sync()
  .then(()=>{
      console.log("\r\n Data base init done");
      server.listen(port);
  })
  .catch((e) => { 
      console.log(`failed:${e}`); process.exit(0); 
  });

}else{
  server.listen(port);
}
