const router = require('express').Router();

const addressRoute = require('./address');
const authRoute = require('./auth');
const brandRoute = require('./brand');
const cartRoute = require('./cart');
const merchantRoute = require('./merchant');
const orderRoute = require('./order');
const userRoute = require('./user');
const categoryRoute = require('./category');
const productRoute = require('./product');
const wishlistRoute = require('./wishlist');
const reviewRoute = require('./review');


router.use('/address', addressRoute);
router.use('/auth', authRoute);
router.use('/brand', brandRoute);
router.use('/cart', cartRoute);
router.use('/merchant', merchantRoute);
router.use('/order', orderRoute);
router.use('/user', userRoute);
router.use('/category', categoryRoute);
router.use('/product', productRoute);
router.use('/wishlist', wishlistRoute);
router.use('/review', reviewRoute);

module.exports = router;
