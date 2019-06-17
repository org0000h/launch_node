#!/usr/bin/env node
const server_config = require('./config_server');
const app = require('./app');
const http = require('http');
const https = require('https');
const fs = require('fs');
const socket_io = require('socket.io');
const webSocketService = require('./webSocketService');
const db = require('./database/db');
require("./database/loadModels");
http.globalAgent.maxSockets = server_config.maxSockets;

let servers = {};

//create http server
if(server_config.http_enable){
    servers.http_server = http.createServer(app.callback());
}

//create https server
if(server_config.https_enable){
    let credentials = loadTlsInfo(
        __dirname + '/../ecc_cert/ecc.key', 
        __dirname + '/../ecc_cert/ecc.crt');
    servers.https_server = https.createServer(credentials,app.callback());
}
//create websocket server 
if(server_config.websocket){
    servers.websocket_server = http.createServer();
    let io = socket_io(servers.websocket_server);
    webSocketService(io);
}
//create websocket server over tls        
if(server_config.websocket_ssl){
    let credentials = loadTlsInfo(
        __dirname + '/../ecc_cert/ecc.key', 
        __dirname + '/../ecc_cert/ecc.crt');
    servers.websocket_ssl_server = https.createServer(credentials);
    let io = socket_io(servers.websocket_ssl_server);
    webSocketService(io);
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
            process.stderr.log(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            process.stderr.log(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
        }
    }
}
function printListeningServer(server, port){
    return ()=>{
        process.stderr.log(`${server} 'is listening on port: + ${port}`);
      }
}
function startServer(servers){
    if (server_config.db_enable) {
        db.sync()
        .then(()=>{
            process.stderr.log("\r\nDatabase sync done");
            servers_listen(servers);
        })
        .catch((e) => { 
            process.stderr.log(`failed:${e}`); process.exit(0); 
        });
      }else{
        servers_listen(servers);
    }

    
}

function loadTlsInfo(path_key, path_crt){
    let privateKey  = fs.readFileSync(path_key, 'utf8');
    let certificate = fs.readFileSync(path_crt, 'utf8');
    return  {key: privateKey, cert: certificate};
}
function servers_listen(servers){
    let ports_of_servers = {
        http_server:server_config.http_port,
        https_server:server_config.https_port,
        websocket_server:server_config.websocket_port,
        websocket_ssl_server:server_config.websocket_ssl_port,
    }
    for(let server in servers){
        let onError = generateOnError(ports_of_servers[server]);
        servers[server].on('error', onError);
        servers[server].on('listening',printListeningServer(server, ports_of_servers[server]));
        servers[server].listen(ports_of_servers[server]);
    }
} 