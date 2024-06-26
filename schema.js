const Joi = require('joi');

module.exports.productSchema = Joi.object({
    product: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.string().required().min(0),
        filter: Joi.string().valid(
            'Statues', 
            'Wall Art', 
            'Crystal Glass', 
            'Steel and Copper Utensils', 
            'Antique Items', 
            'Decorative Items', 
            'Crockery', 
            'Religious Utensils', 
            'Diya'
        ).required()
    }).required()
});



module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});