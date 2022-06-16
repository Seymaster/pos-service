const Joi = require("joi");

// const pattern = /^[a-zA-Z0-9]*$/
const merchantSchema = {
    merchantPost: Joi.object().keys({
        userId: Joi.string().required(),
        name: Joi.string().required(),
        industry: Joi.string().required(),
        email: Joi.string().required(),
        phoneNumber: Joi.string().required()
    })
}

const paymentSchema = {
    paymentPost: Joi.object().keys({
        phoneNumber: Joi.string().required(),
        paymentCode: Joi.string().required(),
        amount: Joi.number().required(),
        paymentAuthId: Joi.string().required()
    }).options({ allowUnknown: true })
}

const businessSchema = {
    businessPost: Joi.object().keys({
        userId: Joi.string().required(),
        businessName: Joi.string().required(),
        projectName: Joi.string().required(),
        mobileNumber: Joi.string().required(),
        countryCode: Joi.string().required(),
        emailAddress: Joi.string().required()
    }).options({ allowUnknown: true })
}

const projectSchema = {
    projectPost: Joi.object().keys({
        userId: Joi.string().required(),
        projectName: Joi.string().required(),
        mobileNumber: Joi.string().required(),
        countryCode: Joi.string().required(),
        emailAddress: Joi.string().required()
    }).options({ allowUnknown: true })
}

const credentialSchema = {
    credentialPost: Joi.object().keys({
        userId: Joi.string().required(),
        businessType: Joi.string().required(),
        regNumber: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        website: Joi.string().required(),
        coi: Joi.string().required()
    }).options({ allowUnknown: true })
}



module.exports = { merchantSchema, paymentSchema, businessSchema, projectSchema, credentialSchema }