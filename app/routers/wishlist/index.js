const router = require('express').Router();
const orderController = require('./lib/controllers');
const orderMiddleware = require('./lib/middleware');

router.post('/', orderMiddleware.checkUser, orderController.addWishlistItem);
router.get('/', orderMiddleware.checkUser, orderController.getWishlistItem);


module.exports = router;
