const fs = require('fs');
const yaml = require('js-yaml');
const Sequelize = require('sequelize');

const configServerFile = fs.readFileSync(`${__dirname}/../config_server.yml`, 'utf8');
const dev = fs.readFileSync(`${__dirname}/db_dev.yml`, 'utf8');
const release = fs.readFileSync(`${__dirname}/db_release.yml`, 'utf8');

let file = null;
const configServer = yaml.safeLoad(configServerFile);
if (configServer.db_type === 'dev') {
  process.stdout.write('Load dataBase  config_dev...\r\n');
  file = dev;
} else {
  process.stdout.write('Load dataBase  config_release...\r\n');
  file = release;
}
const config = yaml.safeLoad(file);

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
