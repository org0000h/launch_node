const Sequelize = require('sequelize');
const ConfigRelease = require('./config_release');
const ConfigDev = require('./config_dev');
const configServer = require('../config_server');

let config = null;
if (configServer.db_type === 'dev') {
  process.stdout.write(`Load dataBase config ${ConfigDev}...\r\n`);
  config = ConfigDev;
} else {
  process.stdout.write(`Load dataBase config ${ConfigRelease}...\r\n`);
  config = ConfigRelease;
}


const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  pool: {
    max: 100,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: config.logging,
});
module.exports = sequelize;
