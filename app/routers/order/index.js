const router = require('express').Router();
const orderController = require('./lib/controllers');
const orderMiddleware = require('./lib/middleware');

router.post('/add', orderMiddleware.checkUser, orderController.add);
router.get('/search/:orderId', orderMiddleware.checkAuth, orderController.searchById);
router.get('/', orderMiddleware.checkUser, orderController.getOrder);
router.get('/get/:orderId', orderMiddleware.checkAuth, orderController.getOrderById);
router.delete('/cancel/:orderId', orderMiddleware.checkUser, orderController.cancelOrderById);
router.put('/status/item/:itemId', orderMiddleware.checkAuth, orderController.updateOrderById);

module.exports = router;
