const configServer = {
  http_enable: true,
  http_port: 80,

  https_enable: true,
  https_port: 443,

  websocket: true,
  websocket_port: 3000,

  websocket_ssl: true,
  websocket_ssl_port: 3001,

  db_enable: true,
  db_type: 'dev',
  maxSockets: 40000,
};

module.exports = configServer;
