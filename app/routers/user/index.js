const router = require('express').Router();
const userController = require('./lib/controllers');
const userMiddleware = require('./lib/middleware');

router.get('/profile', userMiddleware.verifyToken, userController.profile);
router.put('/updateProfile', userMiddleware.verifyToken, userController.updateProfile);

module.exports = router;
