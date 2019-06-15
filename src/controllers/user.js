module.exports = {
  login: async (ctx) =>{
    console.log(ctx.request.body);
    ctx.body = 'login'
  },
  logout: (ctx) => {
    console.log(ctx.request.body);
    ctx.body = 'logout';
  }

}