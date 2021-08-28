const router = require('express').Router();

const authRoute = require('./auth');
const userRoute = require('./user');
const categoryRoute = require('./category');
const productRoute = require('./product');


router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/category', categoryRoute);
router.use('/product', productRoute);

module.exports = router;
