#!/usr/bin/env node
const server_config = require('./config_server');
const app = require('./app');
const http = require('http');
const https = require('https');
const fs = require('fs');
http.globalAgent.maxSockets = server_config.maxSockets;

let servers = {};

//create http server
if(server_config.http_enable){
    servers.http_server = http.createServer(app.callback());
}

//create https server
if(server_config.https_enable){
    //tls key and crt
    let privateKey  = fs.readFileSync(__dirname + '/../ecc_cert/ecc.key', 'utf8');
    let certificate = fs.readFileSync(__dirname + '/../ecc_cert/ecc.crt', 'utf8');
    let credentials = {key: privateKey, cert: certificate};
    servers.https_server = https.createServer(credentials,app.callback());
}
//create websocket server 
if(server_config.websocket){
    const socket_io = require('socket.io');
    const webSocketService = require('./webSocketService');

    servers.websocket_server = http.createServer();

    let io = socket_io(servers.websocket_server);
    webSocketService(io);
    if(server_config.websocket_ssl){
//create websocket server over tls        
        let privateKey  = fs.readFileSync(__dirname + '/../ecc_cert/ecc.key', 'utf8');
        let certificate = fs.readFileSync(__dirname + '/../ecc_cert/ecc.crt', 'utf8');
        let credentials = {key: privateKey, cert: certificate};
        servers.websocket_ssl_server = https.createServer(credentials);
        let io = socket_io(servers.websocket_ssl_server);
        webSocketService(io);
    }
}

startServer(servers);

// function define
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
function printListeningServer(server, port){
    return ()=>{
        console.log(`${server} 'is listening on port: + ${port}`);
      }
}
function startServer(servers){
    ports_of_servers = {
        http_server:server_config.http_port,
        https_server:server_config.https_port,
        websocket_server:server_config.websocket_port,
        websocket_ssl_server:server_config.websocket_ssl_port,
    }
    for(server in servers){
        let onError = generateOnError(ports_of_servers[server]);
        servers[server].on('error', onError);
        servers[server].on('listening',printListeningServer(server, ports_of_servers[server]));
        if (server_config.db_enable) {
            const db = require('../persistence/db');
            require("../persistence/loadModels");
            db.sync()
            .then(()=>{
                console.log("\r\n Database sync done");
                servers[server].listen(ports_of_servers[server]);
            })
            .catch((e) => { 
                console.log(`failed:${e}`); process.exit(0); 
            });
          }else{
            servers[server].listen(ports_of_servers[server]);
          }
    }
    
}