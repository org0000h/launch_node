const fs = require('fs');

const files = fs.readdirSync(`${__dirname}/active_record_tables`);

const jsFiles = files.filter(f => f.endsWith('.js'), files);

module.exports = {};

jsFiles.forEach((file) => {
  process.stdout.write(`import model from file ${file}...\r\n`);
  const name = file.substring(0, file.length - 3);
  // eslint-disable-next-line import/no-dynamic-require
  // eslint-disable-next-line global-require
  module.exports[name] = require(`${__dirname}/active_record_tables/${file}`);
});
