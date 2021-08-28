const router = require('express').Router();
const authController = require('./lib/controllers');
const authMiddleware = require('./lib/middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware.verifyToken, authController.logout);

module.exports = router;
