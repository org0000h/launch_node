config_server = {
    http_enable :true,
    http_port :80,

    https_enable :true,
    https_port :443,

    websocket :true,
    websocket_port :3000,

    websocket_ssl :true,
    websocket_ssl_port :3001,
    db_enable :false,
    maxSockets :40000
}

module.exports = config_server;