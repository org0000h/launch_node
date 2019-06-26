const Sequelize = require('sequelize');
const configServer = require('../config_server');

let config = null;
if (configServer.db_type === 'dev') {
  process.stdout.write('Load dataBase  config_dev...\r\n');
  // eslint-disable-next-line global-require
  config = require('./db_dev.json');
} else {
  process.stdout.write('Load dataBase  config_release...\r\n');
  // eslint-disable-next-line global-require
  config = require('./db_release.json');
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
  logging: config.logging || console.log,
  timezone: config.timezone,
});
module.exports = sequelize;
