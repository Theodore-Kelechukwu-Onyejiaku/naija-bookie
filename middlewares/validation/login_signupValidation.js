//validation using hapi/joi
const  Joi = require("@hapi/joi");

exports.validate = data =>{
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
        firstname: Joi.string().min(3),
        lastname: Joi.string().min(3),
        gender: Joi.string().min(1)
    })

    //return result of operation
    return schema.validate(data);
}