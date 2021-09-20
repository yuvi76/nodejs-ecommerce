const router = require('express').Router();
const reviewController = require('./lib/controllers');
const reviewMiddleware = require('./lib/middleware');

router.post('/add', reviewMiddleware.checkUser, reviewController.add);
router.get('/getAllReviews', reviewMiddleware.checkAdmin, reviewController.getAllReviews);
router.get('/getAllReviewsByProduct/:sSlug', reviewMiddleware.checkUser, reviewController.getAllReviewsByProduct);
router.put('/edit/:reviewId', reviewMiddleware.checkUser, reviewController.editReviewById);
router.put('/update/:reviewId', reviewMiddleware.checkAdmin, reviewController.updateReviewById);
router.delete('/delete/:reviewId', reviewMiddleware.checkUser, reviewController.deleteReviewById);

module.exports = router;
