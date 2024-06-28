const Joi = require('joi');

const blogJoiSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    selectedCategory: Joi.string().valid('education', 'technology', 'travel', 'health', 'parenting', 'finance', 'photography', 'business/entrepreneurship', 'music', 'food', 'sports', 'lifestyle', 'history').required(),
    content: Joi.string().allow('').optional(),
    username: Joi.string().optional(),
    image: Joi.string().optional(),
    createdAt: Joi.date().default(Date.now)
});

module.exports = blogJoiSchema;
