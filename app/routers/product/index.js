const router = require('express').Router();
const productController = require('./lib/controllers');
const productMiddleware = require('./lib/middleware');

router.post('/add', productMiddleware.checkAuth, productController.add);
router.get('/getProducts', productMiddleware.checkAuth, productController.getProducts);
router.get('/get/:id', productMiddleware.checkAuth, productController.getProductById);
router.put('/update/:id', productMiddleware.checkAuth, productController.updateProductById);
router.delete('/delete/:id', productMiddleware.checkAuth, productController.deleteProductById);
router.get('/list', productController.getAllProduct);
router.get('/getProductByCategory/:slug', productController.getProductByCategory);
router.get('/getProductByBrand/:slug', productController.getProductByBrand);
router.get('/search/:name', productController.getProductByName);


module.exports = router;
