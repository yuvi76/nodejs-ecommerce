const { Category } = require('../../../models');
const controllers = {};

// Create Category  
controllers.create = (req, res) => {
    try {
        if (!req.body.sName || _.isEmptyString(req.body.sName)) return res.reply(messages.required_field("Name"));
        if (!req.body.sDescription || _.isEmptyString(req.body.sDescription)) return res.reply(messages.required_field("Description"));
        const category = new Category({
            sName: req.body.sName,
            sDescription: req.body.sDescription,
            aProducts: req.body.aProducts,
        });

        category.save()
            .then((result) => {
                return res.reply(messages.created('Category'), result);
            })
            .catch((error) => {
                console.log("error from mongo" + error);
                return res.reply(messages.already_exists('Category'));
            });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Get All Category
controllers.getCategory = async (req, res, next) => {
    try {
        await Category.find({}, (err, categories) => {
            if (err) return res.reply(messages.error())
            return res.reply(messages.successfully('Category List'), categories);
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

// Get store categories api
controllers.list = async (req, res, next) => {
    try {
        await Category.find({ bIsActive: true }, (err, categories) => {
            if (err) return res.reply(messages.error())
            return res.reply(messages.successfully('Category List'), categories);
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

// Get category by id
controllers.getCategoryById = async (req, res, next) => {
    try {
        Category.findById(req.params.id).populate({
            path: 'aProducts',
            select: 'sName'
        }).exec((err, category) => {
            if (err)
                return res.reply(messages.error());
            if (!category)
                return res.reply(messages.not_found('Category'));
            return res.reply(messages.successfully('Category'), category);
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

// Update category by id
controllers.updateCategoryById = async (req, res, next) => {
    try {
        if (!req.body.sName || _.isEmptyString(req.body.sName)) return res.reply(messages.required_field("Name"));
        if (!req.body.sDescription || _.isEmptyString(req.body.sDescription)) return res.reply(messages.required_field("Description"));
        if (!req.body.bIsActive) return res.reply(messages.required_field("Status"));
        let oCategory = {
            sName: req.body.sName,
            sDescription: req.body.sDescription,
            bIsActive: req.body.bIsActive,
            aProducts: req.body.aProducts,
        }
        await Category.findOneAndUpdate({ _id: req.params.id }, oCategory, { new: true }, (err, category) => {
            if (err)
                return res.reply(messages.error());
            if (!category)
                return res.reply(messages.not_found('Category'));
            return res.reply(messages.updated('Category'), category);
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

// Delete category by id
controllers.deleteCategoryById = async (req, res, next) => {
    try {
        await Category.deleteOne({ _id: req.params.id }, (err, category) => {
            if (err)
                return res.reply(messages.error());
            if (!category)
                return res.reply(messages.not_found('Category'));
            return res.reply(messages.deleted('Category'));
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

module.exports = controllers;
