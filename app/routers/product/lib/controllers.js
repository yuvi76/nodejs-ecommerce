const { Product, Brand, Category, Wishlist } = require('../../../models');
const mongoose = require('mongoose');
const redis = require('../../../utils/lib/redis');
const controllers = {};

// Add Product  
controllers.add = (req, res) => {
    try {
        if (!req.body.oBrandId) return res.reply(messages.required_field("Brand ID"));
        if (!req.body.sName || _.isEmptyString(req.body.sName)) return res.reply(messages.required_field("Name"));
        if (!req.body.nPrice) return res.reply(messages.required_field("Price"));
        if (!req.body.sDescription || _.isEmptyString(req.body.sDescription)) return res.reply(messages.required_field("Description"));
        if (!req.body.nQuantity) return res.reply(messages.required_field("Quantity"));
        if (!req.body.bTaxable) return res.reply(messages.required_field("Tax Status"));
        if (_.isValidObjectID(req.body.oBrandId)) res.reply(messages.invalid("Brand ID"));
        if (_.isValidNumber(req.body.nPrice)) res.reply(messages.invalid("Price"));
        if (_.isValidNumber(req.body.nQuantity)) res.reply(messages.invalid("Quantity"));
        
        const product = new Product({
            oBrandId: req.body.oBrandId,
            sName: req.body.sName,
            nPrice: req.body.nPrice,
            bTaxable: req.body.bTaxable,
            sDescription: req.body.sDescription,
            nQuantity: req.body.nQuantity,
            // productImage: req.file.filename,
        });

        product.save()
            .then((result) => {
                return res.reply(messages.created('Product'), result);
            })
            .catch((error) => {
                console.log("error from mongo" + error);
                return res.reply(messages.already_exists('Product'));
            });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Get All Product
controllers.getProducts = async (req, res, next) => {
    try {
        let aProducts = [];
        if (req.role == "merchant") {
            const aBrands = await Brand.find({
                oMerchantId: req.oMerchantId
            }).populate('oMerchantId', '_id');

            const brandId = aBrands[0]['_id'];

            aProducts = await Product.find({})
                .populate({
                    path: 'oBrandId',
                    populate: {
                        path: 'oMerchantId',
                        model: 'Merchant'
                    }
                })
                .where('oBrandId', brandId);
        } else {
            aProducts = await redis.getAsync("Product").then(async function (result) {
                if (!result) {
                    result = await Product.find({}).populate({
                        path: 'oBrandId',
                        populate: {
                            path: 'oMerchantId',
                            model: 'Merchant'
                        }
                    });
                    redis.setAsync("Product", result);
                }
                return result;
            });
        }
        if (!aProducts) return res.reply(messages.not_found('Products'));
        return res.reply(messages.no_prefix('Product List'), aProducts);
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

// Get Product By Id
controllers.getProductById = async (req, res) => {
    try {
        if (!req.params.id) return res.reply(messages.not_found("Product ID"));

        let aProducts = [];

        if (req.role == "merchant") {
            const aBrands = await Brand.find({
                oMerchantId: req.oMerchantId
            }).populate('oMerchantId', '_id');

            const brandId = aBrands[0]['_id'];

            aProducts = await Product.findOne({})
                .populate({
                    path: 'oBrandId',
                    populate: {
                        path: 'oMerchantId',
                        model: 'Merchant'
                    }
                })
                .where('oBrandId', brandId);
        } else {
            aProducts = await Product.findOne({}).populate({
                path: 'oBrandId',
                populate: {
                    path: 'oMerchantId',
                    model: 'Merchant'
                }
            });
        }
        if (!aProducts) return res.reply(messages.not_found('Products'));
        return res.reply(messages.no_prefix('Product List'), aProducts);
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Update Product By Id
controllers.updateProductById = async (req, res, next) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, product) => {
            if (err) return res.reply(messages.error());
            if (!product) return res.reply(messages.not_found("Product"));
            return res.reply(messages.updated("Product Detail"), product);
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Delete Product By Id
controllers.deleteProductById = async (req, res, next) => {
    try {
        await Product.deleteOne({ _id: req.params.id }, (err, product) => {
            if (err) return res.reply(messages.error());
            return res.reply(messages.deleted("Product"));
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Get All Product
controllers.getAllProduct = async (req, res, next) => {
    try {
        const userDoc = _.decodeToken(req.headers.authorization);
        if (userDoc) {
            const aProducts = await redis.getAsync("All-Product-List").then(async function (result) {
                if (!result) {
                    result = await Product.aggregate([
                        {
                            $match: { bIsActive: true }
                        },
                        {
                            $lookup: {
                                from: 'wishlists',
                                let: { product: '$_id' },
                                pipeline: [
                                    {
                                        $match: {
                                            $and: [
                                                { $expr: { $eq: ['$$product', '$oProductId'] } },
                                                { user: new mongoose.Types.ObjectId(userDoc.id) }
                                            ]
                                        }
                                    }
                                ],
                                as: 'isLiked'
                            }
                        },
                        {
                            $addFields: {
                                isLiked: { $arrayElemAt: ['$isLiked.isLiked', 0] }
                            }
                        },
                        {
                            $lookup: {
                                from: 'brands',
                                localField: 'oBrandId',
                                foreignField: '_id',
                                as: 'brands'
                            }
                        },
                        {
                            $unwind: '$brands'
                        },
                        {
                            $addFields: {
                                'oBrandId.sName': '$brands.sName',
                                'oBrandId._id': '$brands._id',
                                'oBrandId.bIsActive': '$brands.bIsActive'
                            }
                        },
                        {
                            $lookup: {
                                from: 'reviews',
                                localField: '_id',
                                foreignField: 'oProductId',
                                as: 'reviews'
                            }
                        },
                        {
                            $addFields: {
                                totalRatings: { $sum: '$reviews.rating' },
                                totalReviews: { $size: '$reviews' }
                            }
                        },
                        {
                            $addFields: {
                                averageRating: {
                                    $cond: [
                                        { $eq: ['$totalReviews', 0] },
                                        0,
                                        { $divide: ['$totalRatings', '$totalReviews'] }
                                    ]
                                }
                            }
                        },
                        { $project: { brands: 0, reviews: 0 } }
                    ]);
                    redis.setAsync("All-Product-List", result);
                }
                return result;
            });
            return res.reply(messages.no_prefix('Product List'), {
                products: aProducts
                    .filter(item => item?.oBrandId?.bIsActive === true)
                    .reverse()
                    .slice(0, 8),
                page: 1,
                pages: aProducts.length > 0 ? Math.ceil(aProducts.length / 8) : 0,
                totalProducts: aProducts.length
            });
        } else {
            const aProducts = await Product.aggregate([
                {
                    $match: { bIsActive: true }
                },
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'oBrandId',
                        foreignField: '_id',
                        as: 'brands'
                    }
                },
                {
                    $unwind: '$brands'
                },
                {
                    $addFields: {
                        'oBrandId.sName': '$brands.sName',
                        'oBrandId._id': '$brands._id',
                        'oBrandId.bIsActive': '$brands.bIsActive'
                    }
                },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'oProductId',
                        as: 'reviews'
                    }
                },
                {
                    $addFields: {
                        totalRatings: { $sum: '$reviews.rating' },
                        totalReviews: { $size: '$reviews' }
                    }
                },
                {
                    $addFields: {
                        averageRating: {
                            $cond: [
                                { $eq: ['$totalReviews', 0] },
                                0,
                                { $divide: ['$totalRatings', '$totalReviews'] }
                            ]
                        }
                    }
                },
                { $project: { brands: 0, reviews: 0 } }
            ]);

            return res.reply(messages.no_prefix('Product List'), {
                products: aProducts
                    .filter(item => item?.oBrandId?.bIsActive === true)
                    .reverse()
                    .slice(0, 8),
                page: 1,
                pages: aProducts.length > 0 ? Math.ceil(aProducts.length / 8) : 0,
                totalProducts: aProducts.length
            });
        }
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Get Products By Category
controllers.getProductByCategory = async (req, res, next) => {
    try {
        const userDoc = _.decodeToken(req.headers.authorization);
        const aCategory = await Category.findOne(
            { sSlug: req.params.slug, bIsActive: true },
            'aProducts -_id'
        ).populate({
            path: 'aProducts',
            match: {
                bIsActive: true
            },
            populate: {
                path: 'oBrandId',
                model: 'Brand',
                select: 'sName bIsActive'
            }
        });
        if (!aCategory) return res.reply(messages.not_found('Category'));
        let aProducts = [];
        if (userDoc) {
            const aWishlist = await Wishlist.find({
                user: userDoc.id,
                bIsActive: true
            }).populate({
                path: 'product',
                select: '_id'
            });

            const ps = aCategory.aProducts || [];

            const newPs = [];
            ps.map(p => {
                let bIsLiked = false;

                aWishlist.map(w => {
                    if (String(w.product._id) === String(p._id)) {
                        bIsLiked = true;
                    }
                });

                const newProduct = { ...p.toObject(), bIsLiked };

                newPs.push(newProduct);
            });

            aProducts = newPs;
        } else {
            aProducts = aCategory.aProducts;
        }

        return res.reply(messages.successfully('Product List'), aProducts);

    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Get Products By Brand
controllers.getProductByBrand = async (req, res, next) => {
    try {
        const userDoc = _.decodeToken(req.headers.authorization);
        const aBrand = await Brand.findOne({ sSlug: req.params.slug, bIsActive: true });
        if (!aBrand) return res.reply(messages.not_found('Brand'));

        if (userDoc) {
            const aProducts = await Product.aggregate([
                {
                    $match: {
                        bIsActive: true,
                        oBrandId: aBrand._id
                    }
                },
                {
                    $lookup: {
                        from: 'wishlists',
                        let: { product: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $and: [
                                        { $expr: { $eq: ['$$product', '$oProductId'] } },
                                        { user: new mongoose.Types.ObjectId(userDoc.id) }
                                    ]
                                }
                            }
                        ],
                        as: 'isLiked'
                    }
                },
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'oBrandId',
                        foreignField: '_id',
                        as: 'brands'
                    }
                },
                {
                    $addFields: {
                        isLiked: { $arrayElemAt: ['$isLiked.isLiked', 0] }
                    }
                },
                {
                    $unwind: '$brands'
                },
                {
                    $addFields: {
                        'oBrandId.sName': '$brands.sName',
                        'oBrandId._id': '$brands._id',
                        'oBrandId.bIsActive': '$brands.bIsActive'
                    }
                },
                { $project: { brands: 0 } }
            ]);
            return res.reply(messages.successfully('Product List'), aProducts);
        } else {
            const aProducts = await Product.find({
                oBrandId: aBrand._id,
                bIsActive: true
            }).populate('oBrandId', 'sName');
            return res.reply(messages.successfully('Product List'), aProducts);
        }


    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Get Products By Name
controllers.getProductByName = async (req, res, next) => {
    try {
        const aProducts = await Product.find(
            { sName: { $regex: new RegExp(req.params.name), $options: 'is' }, bIsActive: true },
            { sName: 1, sSlug: 1, sImageUrl: 1, nPrice: 1, _id: 0 }
        );
        if (aProducts.length <= 0) return res.reply(messages.not_found('Product'));
        return res.reply(messages.successfully('Product List'), aProducts);
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}
module.exports = controllers;
