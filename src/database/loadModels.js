const fs = require('fs');

const files = fs.readdirSync(`${__dirname}/models`);

const jsFiles = files.filter(f => f.endsWith('.js'), files);

module.exports = {};

jsFiles.forEach((file) => {
  process.stdout.write(`import model from file ${file}...\r\n`);
  const name = file.substring(0, file.length - 3);
  module.exports[name] = require(`${__dirname}/models/${file}`);
});
