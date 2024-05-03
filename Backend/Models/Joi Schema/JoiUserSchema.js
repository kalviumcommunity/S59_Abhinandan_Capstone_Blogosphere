const Joi = require('joi');

const userJoiSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = userJoiSchema;
