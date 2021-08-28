const router = require('express').Router();
const controllers = require('./lib/controllers');

router.post('/signup', controllers.register);

module.exports = router;
