const { Category } = require('../../../models');
const controllers = {};

// Create Category  
controllers.create = (req, res) => {
    try {
        // if (!req.userId) return res.reply(messages.unauthorized());
        const category = new Category({
            sCategoryName: req.body.sCategoryName
        });

        category.save()
            .then((result) => {
                return res.reply(messages.created('Category'), result);
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

// Get All Category
controllers.getCategory = async (req, res, next) => {
    try {
        // if (!req.userId) return res.reply(messages.unauthorized());

        await Category.find({}, "sCategoryName createdAt _id", (err, categories) => {
            if (err) return res.reply(messages.error())
            return res.reply(messages.successfully('User Login'), { count: categories.length, categories });
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

module.exports = controllers;
