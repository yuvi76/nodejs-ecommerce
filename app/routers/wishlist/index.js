const router = require('express').Router();
const wishlistController = require('./lib/controllers');
const wishlistMiddleware = require('./lib/middleware');

router.post('/', wishlistMiddleware.checkUser, wishlistController.addWishlistItem);
router.get('/', wishlistMiddleware.checkUser, wishlistController.getWishlistItem);


module.exports = router;
