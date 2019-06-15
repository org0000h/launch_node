const koa_router =      require('koa-router');
const user =            require('../controllers/user');
let router = new koa_router();

router.post('/user/login',  user.login);
router.post('/user/logout', user.logout);

module.exports = router;