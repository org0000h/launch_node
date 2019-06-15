"use strict";
const Koa =             require('koa');
const koa_morgan =      require('koa-morgan');
const koa_helmet =      require('koa-helmet');
const koa_body =        require('koa-body');
const cors =            require('@koa/cors');
const static_cache =    require('koa-static-cache');
const serve =           require('koa-static');
const koa_json_mask =   require('koa-json-mask');
const koa_compose =     require('koa-compose');

const app = new Koa();

// third patry middleware
// HTTP requests logger
if (process.env.NODE_ENV !== 'test') {
  app.use(koa_morgan('[:date[clf]] ":method :url HTTP/:http-version" :status - :response-time ms'));
}

// my middleware
let router_user = require('./routes/user');

const all = koa_compose([
  koa_helmet(),
  cors(),
  static_cache('./satic_files', {maxAge: 60 * 60}),
  koa_body({jsonLimit: '1kb'}),
  koa_json_mask(),

  router_user.routes(),
  router_user.allowedMethods()
]);
app.use(all);

module.exports = app;
