const router = require('express').Router();
const cartController = require('./lib/controllers');
const cartMiddleware = require('./lib/middleware');

router.post('/add', cartController.add);
router.delete('/delete/:cartId', cartController.deleteCartById);
router.post('/add/:cartId', cartController.addProductToCart);
router.delete('/delete/:cartId/:productId', cartController.removeProductFromCart);

module.exports = router;
