const { Wishlist } = require('../../../models');
const controllers = {};

// Add Item  
controllers.addWishlistItem = async (req, res) => {
    try {
        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { oProductId: req.body.oProductId, oUserId: req.userId },
            { oProductId: req.body.oProductId, oUserId: req.userId, bIsLiked: req.body.bIsLiked },
            { new: true }
        );

        if (updatedWishlist !== null) {
            return res.reply(messages.successfully('Item Updated to your wishlist'), updatedWishlist);
        } else {
            const wishlist = new Wishlist({
                oProductId: req.body.oProductId,
                bIsLiked: req.body.bIsLiked,
                oUserId: req.userId
            });

            wishlist.save()
                .then(async (result) => {
                    return res.reply(messages.successfully('Item Added to your wishlist'), result);
                })
                .catch((error) => {
                    console.log("error from mongo" + error);
                    return res.reply(messages.server_error());
                });
        }
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Get Item  
controllers.getWishlistItem = async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ oUserId: req.userId, bIsLiked: true })
            .populate({
                path: 'oProductId',
                select: 'sName sSlug nPrice sImageUrl'
            }).sort('-updatedAt');

        return res.reply(messages.successfully('Wishlist Details'), wishlist);

    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

module.exports = controllers;
