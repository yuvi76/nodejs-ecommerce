const router = require('express').Router();
const addressController = require('./lib/controllers');
const addressMiddleware = require('./lib/middleware');

router.post('/add', addressController.add);
router.get('/', addressController.getAddress);
router.get('/:id', addressController.getAddressById);
router.put('/:id', addressController.updateAddressById);
router.delete('/delete/:id', addressController.deleteAddressById);

module.exports = router;
