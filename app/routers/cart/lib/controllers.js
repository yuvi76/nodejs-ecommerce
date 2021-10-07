const { Cart, Product } = require("../../../models");
const controllers = {};

// Add Cart
controllers.add = (req, res) => {
    try {
        if (!req.body.oProductId) return res.reply(messages.required_field("Product ID"));
        if (!req.body.nQuantity) return res.reply(messages.required_field("Quantity"));
        if (_.isValidObjectID(req.body.oProductId)) res.reply(messages.invalid("Product ID"));
        if (_.isValidNumber(req.body.nQuantity)) res.reply(messages.invalid("Product Quantity"));

        let aProducts = [{
            oProductId: req.body.oProductId,
            nQuantity: req.body.nQuantity
        }]

        const cart = new Cart({
            oUserId: req.userId,
            aProducts
        });

        cart.save().then((result) => {
            decreaseQuantity(aProducts);
            return res.reply(messages.added("Cart"), result);
        }).catch((error) => {
            console.log("error from mongo" + error);
            return res.reply(messages.server_error());
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Delete Cart By Id
controllers.deleteCartById = async (req, res, next) => {
    try {
        await Cart.deleteOne({ _id: req.params.cartId }, (err, result) => {
            if (err) return res.reply(messages.error());
            return res.reply(messages.deleted("Cart"));
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Add Product To Cart
controllers.addProductToCart = async (req, res, next) => {
    try {
        if (!req.body.oProductId) return res.reply(messages.required_field("Product ID"));
        if (!req.body.nQuantity) return res.reply(messages.required_field("Quantity"));
        if (_.isValidObjectID(req.body.oProductId)) res.reply(messages.invalid("Product ID"));
        if (_.isValidNumber(req.body.nQuantity)) res.reply(messages.invalid("Product Quantity"));
        
        let aProducts = [{
            oProductId: req.body.oProductId,
            nQuantity: req.body.nQuantity
        }]

        await Cart.updateOne({ _id: req.params.cartId }, { $push: { aProducts } }, (err, result) => {
            if (err) return res.reply(messages.error());
            return res.reply(messages.successfully("Product Added"));
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Remove Product From Cart
controllers.removeProductFromCart = async (req, res, next) => {
    try {
        await Cart.updateOne({ _id: req.params.cartId }, { $pull: { aProducts: { oProductId: req.params.productId } } }, (err, result) => {
            if (err) return res.reply(messages.error());
            return res.reply(messages.deleted("Product From Cart"), result);
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

const decreaseQuantity = aProducts => {
    let bulkOptions = aProducts.map(item => {
        return {
            updateOne: {
                filter: { _id: item.oProductId },
                update: { $inc: { nQuantity: -item.nQuantity } }
            }
        };
    });

    Product.bulkWrite(bulkOptions);
};
module.exports = controllers;
