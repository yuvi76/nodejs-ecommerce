const router = require('express').Router();

const addressRoute = require('./address');
const authRoute = require('./auth');
const brandRoute = require('./brand');
const orderRoute = require('./order');
const userRoute = require('./user');
const categoryRoute = require('./category');
const productRoute = require('./product');


router.use('/address', addressRoute);
router.use('/auth', authRoute);
router.use('/brand', brandRoute);
router.use('/order', orderRoute);
router.use('/user', userRoute);
router.use('/category', categoryRoute);
router.use('/product', productRoute);

module.exports = router;
