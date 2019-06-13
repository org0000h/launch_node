"use strict";
const Koa =             require('koa');
const koa_logger =      require('koa-logger');
const koa_body =        require('koa-body');
const koa_router =      require('koa-router');
const cors =            require('@koa/cors');
const static_cache =    require('koa-static-cache');
const serve =           require('koa-static');

const app = new Koa();

// third patry middleware
 app.use(koa_logger())
    .use(static_cache('./satic_files', {maxAge: 60 * 60}))
    .use(koa_body())
    .use(cors);

// my middleware
app.use(ctx => {
    console.log ( `Request Body: ${JSON.stringify(ctx.request.body)}`);
  });
let router = new koa_router();
router.get()

app.listen(3000);
console.log('listening on port:3000');