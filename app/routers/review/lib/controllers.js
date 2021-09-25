const { Review, Product } = require('../../../models');
const controllers = {};

// Add Review  
controllers.add = async (req, res) => {
    try {
        if (!req.body.oProductId) return res.reply(messages.required_field("Product ID"));
        if (!req.body.sTitle) return res.reply(messages.required_field("Title"));
        if (!req.body.nRating) return res.reply(messages.required_field("Rating"));
        if (!req.body.sReview) return res.reply(messages.required_field("Review"));
        if (!req.body.bIsRecommended) return res.reply(messages.required_field("Recommended Status"));
        if (_.isValidObjectID(req.body.oProductId)) res.reply(messages.invalid("Product ID"));
        const review = new Review({
            oProductId: req.body.oProductId,
            sTitle: req.body.sTitle,
            nRating: req.body.nRating,
            sReview: req.body.sReview,
            bIsRecommended: req.body.bIsRecommended,
            oUserId: req.userId
        });

        review.save()
            .then(async (result) => {
                return res.reply(messages.no_prefix('Your review has been added successfully and will appear when approved!'), result);
            })
            .catch((error) => {
                console.log("error from mongo" + error);
                return res.reply(messages.server_error());
            });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Get All Reviews  
controllers.getAllReviews = async (req, res) => {
    try {
        const aReviews = await Review.find({})
            .populate({
                path: 'oUserId',
                select: 'oName.sFirstname'
            })
            .populate({
                path: 'oProductId',
                select: 'sName sSlug sImageUrl'
            })
            .sort('-createdAt');

        return res.reply(messages.successfully('Reviews Details'), aReviews);

    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Get All Reviews By Product  
controllers.getAllReviewsByProduct = async (req, res) => {
    try {
        const oProduct = await Product.findOne({ sSlug: req.params.sSlug });

        if (!oProduct || (oProduct && oProduct?.oBrandId?.bIsActive === false)) return res.reply(messages.not_found('For this product Reviews'));

        const aReviews = await Review.find({ oProductId: oProduct._id, eStatus: 'Approved' })
            .populate({
                path: 'oUserId',
                select: 'oName.sFirstname'
            })
            .sort('-createdAt');

        return res.reply(messages.successfully('Reviews Details'), aReviews);

    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};


// Edit Reviews By Id  
controllers.editReviewById = async (req, res) => {
    try {
        if (!req.body.sTitle) return res.reply(messages.required_field("Title"));
        if (!req.body.nRating) return res.reply(messages.required_field("Rating"));
        if (!req.body.sReview) return res.reply(messages.required_field("Review"));
        if (!req.body.bIsRecommended) return res.reply(messages.required_field("Recommended Status"));
        let oReview = {
            sTitle: req.body.sTitle,
            nRating: req.body.nRating,
            sReview: req.body.sReview,
            bIsRecommended: req.body.bIsRecommended
        }
        await Review.findOneAndUpdate({ _id: req.params.reviewId }, oReview, { new: true }, (err, review) => {
            if (err)
                return res.reply(messages.error());
            if (!review)
                return res.reply(messages.not_found('Review'));
            return res.reply(messages.updated('Review'), review);
        });

    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};


// Update Reviews By Id  
controllers.updateReviewById = async (req, res) => {
    try {
        if (!req.body.eStatus) return res.reply(messages.required_field("Review Status"));
        await Review.findOneAndUpdate({ _id: req.params.reviewId }, { eStatus: req.body.eStatus }, { new: true }, (err, review) => {
            if (err)
                return res.reply(messages.error());
            if (!review)
                return res.reply(messages.not_found('Review'));
            return res.reply(messages.updated('Review'), review);
        });

    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Delete Review by id
controllers.deleteReviewById = async (req, res, next) => {
    try {
        await Review.deleteOne({ _id: req.params.reviewId }, (err, review) => {
            if (err)
                return res.reply(messages.error());
            if (!review)
                return res.reply(messages.not_found('Review'));
            return res.reply(messages.deleted('Review'));
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}


module.exports = controllers;
