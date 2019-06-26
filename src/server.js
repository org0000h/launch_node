#!/usr/bin/env node
const http = require('http');
const https = require('https');
const fs = require('fs');
const socketIO = require('socket.io');
const app = require('./app');
const serverConfig = require('./config_server.json');
const webSocketService = require('./webSocketService');
const db = require('./database/db');
require('./database/loadModels');

function loadTlsInfo(pathKey, pathCrt) {
  const privateKey = fs.readFileSync(pathKey, 'utf8');
  const certificate = fs.readFileSync(pathCrt, 'utf8');
  return { key: privateKey, cert: certificate };
}

function generateOnError(port) {
  return (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        process.stderr.write(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        process.stderr.write(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
}

function printListeningServer(server, port) {
  return () => {
    process.stdout.write(`${server} is listening on port: ${port}\r\n`);
  };
}
function serversListen(servers) {
  const portsOfServers = {
    http_server: serverConfig.http_port,
    https_server: serverConfig.https_port,
    websocket_server: serverConfig.websocket_port,
    websocket_ssl_server: serverConfig.websocket_ssl_port,
  };
  servers.forEach((server, serverName) => {
    const onError = generateOnError(portsOfServers[serverName]);
    server.on('error', onError);
    server.on('listening', printListeningServer(serverName, portsOfServers[serverName]));
    server.listen(portsOfServers[serverName]);
  });

  Object.keys(servers).forEach((server) => {
    const onError = generateOnError(portsOfServers[server]);
    servers[server].on('error', onError);
    servers[server].on('listening', printListeningServer(server, portsOfServers[server]));
    servers[server].listen(portsOfServers[server]);
  });
}
function startServer(servers) {
  if (serverConfig.db_enable) {
    db.sync()
      .then(() => {
        process.stdout.write('\r\nDatabase sync done\r\n');
        serversListen(servers);
      })
      .catch((e) => {
        process.stderr.write(`failed:${e}\r\n`); process.exit(0);
      });
  } else {
    serversListen(servers);
  }
}

// =======================================================
http.globalAgent.maxSockets = serverConfig.maxSockets;

const startServers = new Map();
//  create http server
if (serverConfig.http_enable) {
  startServers.set('http_server', http.createServer(app.callback()));
}

//  create https server
if (serverConfig.https_enable) {
  const credentials = loadTlsInfo(
    `${__dirname}/../ecc_cert/ecc.key`,
    `${__dirname}/../ecc_cert/ecc.crt`,
  );
  startServers.set('https_server', https.createServer(credentials, app.callback()));
}
// create websocket server
if (serverConfig.websocket) {
  const websocketServer = http.createServer();
  startServers.set('websocket_server', websocketServer);
  const io = socketIO(websocketServer);
  webSocketService(io);
}
// create websocket server over tls
if (serverConfig.websocket_ssl) {
  const credentials = loadTlsInfo(
    `${__dirname}/../ecc_cert/ecc.key`,
    `${__dirname}/../ecc_cert/ecc.crt`,
  );
  const websocketSslServer = https.createServer(credentials);
  startServers.set('websocket_ssl_server', websocketSslServer);
  const io = socketIO(websocketSslServer);
  webSocketService(io);
}
startServer(startServers);
