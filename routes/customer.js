'use strict'
/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
|
*/
const express = require("express");
const router  = express.Router();
const customerController = require("../controllers/customer")
const schema = require("../Middleware/schema");
const { validate } = require("../Middleware/helper");


router.post("/pay/initiate", validate(schema.paymentSchema.paymentPost, 'body') ,customerController.initiatePayment);

router.post("/pay/verify",  customerController.verifyPayment);

router.post("/create/pin",  customerController.createPin);

// router.post("/validate/pin",  customerController.validatePin);

router.get("/customer", customerController.getCustomers)

router.get("/merchant/customer/:merchantId", customerController.getMerchantCustomer)


module.exports = router;