const router = require('express').Router();
const addressController = require('./lib/controllers');
const addressMiddleware = require('./lib/middleware');

router.post('/add', addressMiddleware.checkUser, addressController.add);
router.get('/', addressMiddleware.checkUser, addressController.getAddress);
router.get('/get/:id', addressMiddleware.checkUser, addressController.getAddressById);
router.put('/update/:id', addressMiddleware.checkUser, addressController.updateAddressById);
router.delete('/delete/:id', addressMiddleware.checkUser, addressController.deleteAddressById);

module.exports = router;
