const router = require('express').Router();
const categoryController = require('./lib/controllers');
const categoryMiddleware = require('./lib/middleware');

router.post('/create', categoryController.create);
router.get('/getCategory', categoryController.getCategory);

module.exports = router;
