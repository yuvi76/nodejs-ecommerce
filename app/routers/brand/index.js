const router = require('express').Router();
const brandController = require('./lib/controllers');
const brandMiddleware = require('./lib/middleware');

router.post('/add', brandController.add);
router.post('/list', brandController.getBrand);
router.get('/', brandController.getBrandbyMerchant);
router.get('/:id', brandController.getBrandById);
router.put('/:id', brandController.updateBrandById);
router.delete('delete/:id', brandController.deleteBrandById);

module.exports = router;
