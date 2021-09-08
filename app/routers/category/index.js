const router = require('express').Router();
const categoryController = require('./lib/controllers');
const categoryMiddleware = require('./lib/middleware');

router.post('/create', categoryController.create);
router.get('/', categoryController.getCategory);
router.get('/list', categoryController.list);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategoryById);
router.delete('/:id', categoryController.deleteCategoryById);

module.exports = router;
