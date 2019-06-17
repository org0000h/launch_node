const fs = require('fs');

const files = fs.readdirSync(`${__dirname}/models`);

const js_files = files.filter(f => f.endsWith('.js'), files);

module.exports = {};

for (const f of js_files) {
  console.log(`import model from file ${f}...`);
  const name = f.substring(0, f.length - 3);
  module.exports[name] = require(`${__dirname}/models/${f}`);
}
