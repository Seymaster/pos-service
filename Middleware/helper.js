'use strict';

const Joi = require("joi");


exports.validate = (schema, property) =>{
    return (req, res, next) =>{
        const data = schema.validate(req[property]);
        if (!data.error){
            next();
        }
        else {
            const { error } = data;
            const message = error.details[0].message;
            res.status(422).json({
                status: 422,
                message: message.replace(/['"]/g,'')});
        }
    }
};

