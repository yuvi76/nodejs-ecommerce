const { Order, Product, Cart } = require('../../../models');
const mongoose = require('mongoose');
const { nodemailer } = require('../../../utils');
const controllers = {};

// Add Order  
controllers.add = (req, res) => {
    try {
        if (!req.body.oCartId) return res.reply(messages.required_field("Cart ID"));
        if (!req.body.nTotal) return res.reply(messages.required_field("Total"));
        if (_.isValidObjectID(req.body.oCartId)) res.reply(messages.invalid("Cart ID"));
        if (_.isValidNumber(req.body.nTotal)) res.reply(messages.invalid("Total"));

        const order = new Order({
            oCartId: req.body.oCartId,
            oUserId: req.userId,
            nTotal: req.body.nTotal
        });

        order.save()
            .then(async (result) => {
                await Cart.findById(result.oCartId).populate({ path: 'aProducts.oProductId', populate: { path: 'oBrandId' } });
                nodemailer.send('order_confirmation.html', {
                    SITE_NAME: 'E-commerce',
                    USERNAME: req.sUsername
                }, {
                    from: process.env.SMTP_USERNAME,
                    to: req.sEmail,
                    subject: `Order Confirmation ${result._id}`
                })
                return res.reply(messages.successfully('Order has been placed'), result);
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

// Search Order  
controllers.searchById = async (req, res) => {
    try {
        let aOrder = null;
        console.log(req.userId);
        if (req.role === "admin") {
            aOrder = await Order.find({
                _id: mongoose.Types.ObjectId(req.params.orderId)
            }).populate({
                path: 'oCartId',
                populate: {
                    path: 'aProducts.oProductId',
                    populate: {
                        path: 'oBrandId'
                    }
                }
            });
        } else {
            aOrder = await Order.find({
                _id: mongoose.Types.ObjectId(req.params.orderId),
                oUserId: mongoose.Types.ObjectId(req.userId)
            }).populate({
                path: 'oCartId',
                populate: {
                    path: 'aProducts.oProductId',
                    populate: {
                        path: 'oBrandId'
                    }
                }
            });
        }

        aOrder = aOrder.filter(order => order.oCartId);

        if (aOrder.length > 0) {
            const aNewOrders = aOrder.map(o => {
                return {
                    _id: o._id,
                    nTotal: parseFloat(Number(o.nTotal.toFixed(2))),
                    createdAt: o.createdAt,
                    aProducts: o.oCartId?.aProducts
                };
            });

            aNewOrders.sort((a, b) => b.createdAt - a.createdAt);
            return res.reply(messages.successfully('Order List'), aNewOrders);
        } else {
            return res.reply(messages.successfully('Order List'), { aNewOrders: [] });
        }
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

// Get All Order
controllers.getOrder = async (req, res, next) => {
    try {
        let aOrder = await Order.find({ oUserId: req.userId }).populate({
            path: 'Cart',
            populate: {
                path: 'aProducts.oProductId',
                populate: {
                    path: 'Brand'
                }
            }
        });

        aOrder = aOrder.filter(order => order.oCartId);

        if (aOrder.length > 0) {
            const aNewOrders = aOrder.map(o => {
                return {
                    _id: o._id,
                    nTotal: parseFloat(Number(o.nTotal.toFixed(2))),
                    createdAt: o.createdAt,
                    products: o.cart?.products
                };
            });

            aNewOrders.sort((a, b) => b.createdAt - a.createdAt);
            return res.reply(messages.successfully('Order List'), aNewOrders);
        } else {
            return res.reply(messages.successfully('Order List'), { aNewOrders: [] });
        }
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

// Get Order By Id
controllers.getOrderById = async (req, res) => {
    try {
        let aOrder = null;
        if (req.role === "admin") {
            aOrder = await Order.findOne({ _id: req.params.orderId }).populate({
                path: 'oCartId',
                populate: {
                    path: 'aProducts.oProductId',
                    populate: {
                        path: 'oBrandId'
                    }
                }
            });
        } else {
            aOrder = await Order.findOne({ _id: req.params.orderId, oUserId: req.userId }).populate({
                path: 'oCartId',
                populate: {
                    path: 'aProducts.oProductId',
                    populate: {
                        path: 'oBrandId'
                    }
                }
            });
        }
        if (!aOrder || !aOrder.oCartId) {
            return res.reply(messages.not_found("Order"));
        }

        let oNewOrder = {
            _id: aOrder._id,
            nTotal: aOrder.nTotal,
            createdAt: aOrder.createdAt,
            aProducts: aOrder?.oCartId?.aProducts,
            oCartId: aOrder.oCartId._id
        };

        return res.reply(messages.successfully('Order List'), oNewOrder);
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

// Cancel Order By Id
controllers.cancelOrderById = async (req, res) => {
    try {
        const aOrder = await Order.findOne({ _id: req.params.orderId });
        const foundCart = await Cart.findOne({ _id: aOrder.oCartId });

        increaseQuantity(foundCart.aProducts);

        await Order.deleteOne({ _id: req.params.orderId });
        await Cart.deleteOne({ _id: aOrder.oCartId });

        return res.reply(messages.deleted('Order'));
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

// Update Order By Id
controllers.updateOrderById = async (req, res) => {
    try {
        if (!req.body.cartId) return res.reply(messages.required_field("Cart ID"));
        if (!req.body.orderId) return res.reply(messages.required_field("Order ID"));
        if (_.isValidObjectID(req.body.cartId)) res.reply(messages.invalid("Cart ID"));
        if (_.isValidObjectID(req.body.orderId)) res.reply(messages.invalid("Order ID"));
        const itemId = req.params.itemId;
        const orderId = req.body.orderId;
        const cartId = req.body.cartId;
        const status = req.body.status || 'Cancelled';

        const foundCart = await Cart.findOne({ 'aProducts._id': itemId });
        const foundCartProduct = foundCart.aProducts.find(p => p._id == itemId);

        await Cart.updateOne({ 'aProducts._id': itemId }, { 'aProducts.$.eStatus': status });

        if (status === 'Cancelled') {
            await Product.updateOne({ _id: foundCartProduct.oProductId }, { $inc: { nQuantity: foundCartProduct.nQuantity } });

            const cart = await Cart.findOne({ _id: cartId });
            const items = cart.aProducts.filter(item => item.eStatus === 'Cancelled');

            // All items are cancelled => Cancel order
            if (cart.aProducts.length === items.length) {
                await Order.deleteOne({ _id: orderId });
                await Cart.deleteOne({ _id: cartId });

                return res.reply(messages.successfully(`${req.user.role === "Admin" ? 'Order' : 'Your order'} has been cancelled`));
            }
            return res.reply(messages.successfully('Item has been cancelled'));
        }
        return res.reply(messages.successfully('Item status has been updated'));
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

const increaseQuantity = aProducts => {
    let bulkOptions = aProducts.map(item => {
        return {
            updateOne: {
                filter: { _id: item.oProductId },
                update: { $inc: { nQuantity: item.nQuantity } }
            }
        };
    });

    Product.bulkWrite(bulkOptions);
};

module.exports = controllers;
