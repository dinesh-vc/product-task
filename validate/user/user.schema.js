const {
    string
} = require('@hapi/joi')
const joi = require('@hapi/joi')
let pattern = "/^\d{3}-\d{3}-\d{4}$/";
const schema = {
    user: joi.object({
        firstName: joi.string().max(10 ).required(),
        lastName: joi.string().max(10).required(),
        phoneNumber: joi.number().min(999999999).message("Mobile Number More than 10 Digit").required(),
        email: joi.string().regex(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).min(5).max(50).message("Invalid Email").required(),
        address: joi.string().max(50).required(),
        userImg: joi.required(),
        password: joi.string().alphanum().min(7).max(10).required(),
        confirmPassword: joi.string().alphanum().min(7).max(10).required(),
       

    }),
    login: joi.object({

        email: joi.string().regex(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).min(5).max(50).message("Invalid Email").required(),
        password: joi.string().alphanum().required(),
        submit: joi.required()

    }),

    product: joi.object({
        productName: joi.string().max(10).required(),
        quantity: joi.number().integer().min(10).required(),
        productImgImg: joi.required(),
        quantity: joi.number().integer().min(10).required(),
        submit: joi.required()

    })
};

module.exports = schema;