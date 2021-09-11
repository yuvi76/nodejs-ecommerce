const router = require('express').Router();
const cartController = require('./lib/controllers');
const cartMiddleware = require('./lib/middleware');

router.post('/add', cartMiddleware.checkUser, cartController.add);
router.delete('/delete/:cartId', cartMiddleware.checkUser, cartController.deleteCartById);
router.post('/add/:cartId', cartMiddleware.checkUser, cartController.addProductToCart);
router.delete('/delete/:cartId/:productId', cartMiddleware.checkUser, cartController.removeProductFromCart);

module.exports = router;
