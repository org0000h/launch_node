const Joi = require('@hapi/joi');

module.exports = {
  login: async (ctx) => {
    process.stdout.write(ctx.request.body);
    ctx.body = 'login';
  },
  logout: (ctx) => {
    process.stdout.write(ctx.request.body);
    ctx.body = 'logout';
  },
};
