const Router = require('koa-router');
const user = require('../controllers/user');

const router = new Router();

router.post('/user/login', user.login);
router.post('/user/logout', user.logout);

module.exports = router;
