const router = require('express').Router();
const orderController = require('./lib/controllers');
const orderMiddleware = require('./lib/middleware');

router.post('/add', orderMiddleware.checkUser, orderController.add);
router.get('/', orderMiddleware.checkUser, orderController.getOrder);

module.exports = router;
