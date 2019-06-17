const Koa = require('koa');
const morgan = require('koa-morgan');
const helmet = require('koa-helmet');
const body = require('koa-body');
const cors = require('@koa/cors');
const staticCache = require('koa-static-cache');
const jsonMask = require('koa-json-mask');
const koaCompose = require('koa-compose');

const app = new Koa();

// third patry middleware
// HTTP requests logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('[:date[clf]] ":method :url HTTP/:http-version" :status - :response-time ms'));
}

//  my middleware
const routerUser = require('./routes/user');

//  load middleware
const all = koaCompose([
  helmet(), // HTTP header security
  cors(),
  staticCache(`${__dirname}/../vue-admin-template/dist/`, { maxAge: 60 * 60 }),
  body({ jsonLimit: '1kb' }),
  jsonMask(), // Allow user to restrict the keys returned

  routerUser.routes(),
]);
app.use(all);

module.exports = app;
