"use strict";
const Koa =             require('koa');
const koa_morgan =      require('koa-morgan');
const koa_helmet =      require('koa-helmet');
const koa_body =        require('koa-body');
const koa_router =      require('koa-router');
const cors =            require('@koa/cors');
const static_cache =    require('koa-static-cache');
const serve =           require('koa-static');
const koa_json_mask =   require('koa-json-mask');

const app = new Koa();

// third patry middleware
// HTTP requests logger
if (process.env.NODE_ENV !== 'test') {
  app.use(koa_morgan('[:date[clf]] ":method :url HTTP/:http-version" :status - :response-time ms'));
}
    app.use(koa_helmet())
    .use(cors())
    .use(static_cache('./satic_files', {maxAge: 60 * 60}))
    .use(koa_body({jsonLimit: '1kb'})) // for ctx.request.body
    .use(koa_json_mask()) // Allow user to restrict the keys returned



// my middleware

let router = new koa_router();

router.post('/route',(ctx)=>{
  ctx.body = "route";
})
app.use(router.routes())
.use(router.allowedMethods());


app.use(async function(ctx) {
  console.log( 'request body:',JSON.stringify( ctx.request.body,null,2));
 });

 module.exports = app;


app.listen(3000);
console.log('listening on port:3000');