//validation using hapi/joi
const  Joi = require("@hapi/joi");

exports.validate = data =>{
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required()
    })

    //return result of operation
    return schema.validate(data);
}