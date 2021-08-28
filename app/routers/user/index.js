const router = require('express').Router();
const userController = require('./lib/controllers');
const userMiddleware = require('./lib/middleware');

router.get('/profile', userMiddleware.verifyToken, userController.profile);

module.exports = router;
