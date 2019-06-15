const Sequelize = require('sequelize');
const fs = require('fs');
const Config_release = './config_release';
const Config_dev = './config_dev';
const config_server = require('../config_server');
var config = null;

if (config_server.db_type == 'dev') {
    console.log(`Load dataBase config ${Config_dev}...`);
    config = require(Config_dev);
} else {
    console.log(`Load dataBase config ${Config_release}...`);
    config = require(Config_release);
}


const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  pool: {
    max: 100,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: config.logging
});
module.exports = sequelize;