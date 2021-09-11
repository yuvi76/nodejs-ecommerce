const router = require('express').Router();
const categoryController = require('./lib/controllers');
const categoryMiddleware = require('./lib/middleware');

router.post('/create',categoryMiddleware.checkAdmin, categoryController.create);
router.get('/', categoryController.getCategory);
router.get('/list', categoryController.list);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id',categoryMiddleware.checkAdmin, categoryController.updateCategoryById);
router.delete('/:id',categoryMiddleware.checkAdmin, categoryController.deleteCategoryById);

module.exports = router;
