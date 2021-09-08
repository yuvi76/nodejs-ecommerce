const router = require('express').Router();
const orderController = require('./lib/controllers');
const orderMiddleware = require('./lib/middleware');

router.post('/add', orderController.add);
router.get('/', orderController.getorder);
router.get('/list', orderController.list);
router.get('/:id', orderController.getorderById);

module.exports = router;
