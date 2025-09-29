const Joi = require('joi');
const Listing = require('./models/listing');
const review = require('./models/review');



module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().allow("").required(),

        country: Joi.string().required(),
        price: Joi.number().required(),
         image: Joi.object({
           url: Joi.string().allow("", null),
           filename: Joi.string().allow("", null)
          }).optional().allow(null)
    }).required(),
    
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required()
    }).required()
});
