const { Product } = require('../../../models');
const controllers = {};

// Create Product  
controllers.create = (req, res) => {
    try {
        // if (!req.userId) return res.reply(messages.unauthorized());
        const product = new Product({
            sCategoryId: req.body.sCategoryId,
            sName: req.body.sName,
            sPrice: req.body.sPrice,
            sDescription: req.body.sDescription,
            // productImage: req.file.filename,
            nQuantity: req.body.nQuantity,
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
controllers.getProduct = async (req, res, next) => {
    try {
        // if (!req.userId) return res.reply(messages.unauthorized());

        var nLimit = parseInt(req.body.length);
        var nOffset = parseInt(req.body.start);
        let oTypeQuery = {},
            oSellingTypeQuery = {},
            oSortingOrder = {};
        let oTtextQuery = {
            "sName": new RegExp(req.body.sTextsearch, 'i')
        }


        if (req.body.sSortingType == "Recently Added") {
            oSortingOrder["sCreated"] = -1;
        } else if (req.body.sSortingType == "Most Viewed") {
            oSortingOrder["nView"] = -1;
        } else if (req.body.sSortingType == "Price Low to High") {
            oSortingOrder["nPrice"] = 1;
        } else if (req.body.sSortingType == "Price High to Low") {
            oSortingOrder["nPrice"] = -1;
        } else {
            oSortingOrder["_id"] = -1;
        }


        let data = await Product.aggregate([{
            '$match': {
                '$and': [{
                    nQuantity: {
                        $gt: 1
                    }
                },
                {
                    bStatus: {
                        $ne: false
                    }
                }]
            }
        }, {
            '$sort': oSortingOrder
        }, {
            '$lookup': {
                'from': 'categories',
                'localField': 'sCategoryId',
                'foreignField': '_id',
                'as': 'oCategory'
            }
        }, {
            '$facet': {
                'products': [{
                    "$skip": +nOffset
                }, {
                    "$limit": +nLimit
                }],
                'totalCount': [{
                    '$count': 'count'
                }]
            }
        }]);
        console.log(data);
        let iFiltered = data[0].products.length;
        if (data[0].totalCount[0] == undefined) {
            return res.reply(messages.success('Data'), {
                data: 0,
                "draw": req.body.draw,
                "recordsTotal": 0,
                "recordsFiltered": iFiltered,
            });
        } else {
            return res.reply(messages.no_prefix('Product List'), {
                data: data[0].products,
                "draw": req.body.draw,
                "recordsTotal": data[0].totalCount[0].count,
                "recordsFiltered": iFiltered,
            });
        }
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

module.exports = controllers;
