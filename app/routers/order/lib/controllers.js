const { Order } = require('../../../models');
const controllers = {};

// Add Order  
controllers.add = (req, res) => {
    try {
        // if (!req.userId) return res.reply(messages.unauthorized());
        const order = new Order({
            oCartId: req.body.oCartId,
            oUserId: req.userId,
            nTotal: req.body.nTotal
        });

        order.save()
            .then((result) => {
                return res.reply(messages.created('Order'), result);
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

// Get All Order
controllers.getOrder = async (req, res, next) => {
    try {
        // if (!req.userId) return res.reply(messages.unauthorized());

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
                    created: o.created,
                    products: o.cart?.products
                };
            });

            aNewOrders.sort((a, b) => b.created - a.created);
            return res.reply(messages.successfully('Order List'), aNewOrders);
        } else {
            return res.reply(messages.successfully('Order List'), { aNewOrders: [] });
        }
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}


module.exports = controllers;
