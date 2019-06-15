config_server = {
    port :3000,
    http_enable :true,
    tls_enable :true,
    websocket_enable :true,
    db_enable :false,
    maxSockets :40000
}

module.exports = config_server;