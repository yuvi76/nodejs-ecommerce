const router = require('express').Router();
const brandController = require('./lib/controllers');
const brandMiddleware = require('./lib/middleware');

router.post('/add', brandMiddleware.checkAdmin, brandController.add);
router.post('/list', brandController.getBrand);
router.get('/', brandMiddleware.checkAuth, brandController.getBrandbyMerchant);
router.get('/:id', brandController.getBrandById);
router.put('/:id', brandMiddleware.checkAuth, brandController.updateBrandById);
router.delete('/:id', brandMiddleware.checkAdmin, brandController.deleteBrandById);

module.exports = router;
