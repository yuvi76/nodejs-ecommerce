const router = require('express').Router();
const productController = require('./lib/controllers');
const productMiddleware = require('./lib/middleware');

router.post('/create', productController.create);
router.get('/getProduct', productController.getProduct);
router.get('/getProductByID/:id', productController.getProductByID);

module.exports = router;
