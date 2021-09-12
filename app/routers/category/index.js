const router = require('express').Router();
const categoryController = require('./lib/controllers');
const categoryMiddleware = require('./lib/middleware');

router.post('/create',categoryMiddleware.checkAdmin, categoryController.create);
router.get('/', categoryController.getCategory);
router.get('/list', categoryController.list);
router.get('/get/:id', categoryController.getCategoryById);
router.put('/update/:id',categoryMiddleware.checkAdmin, categoryController.updateCategoryById);
router.delete('/delete/:id',categoryMiddleware.checkAdmin, categoryController.deleteCategoryById);

module.exports = router;
