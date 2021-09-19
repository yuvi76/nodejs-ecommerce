const router = require('express').Router();
const merchantController = require('./lib/controllers');
const merchantMiddleware = require('./lib/middleware');

router.post('/seller-request', merchantController.sellerRequest);
router.get('/list', merchantMiddleware.checkAdmin, merchantController.list);
router.put('/status/:id', merchantMiddleware.checkAdmin, merchantController.updateMerchantById);
router.delete('/delete/:id', merchantMiddleware.checkAdmin, merchantController.deleteMerchantById);
router.post('/signup/:token', merchantController.merchantSignup);

module.exports = router;
