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

router.post("/pay/checkout",  customerController.verifyPayment);

router.put("/update/pin",  customerController.updatePin);

router.post("/validate/pin",  customerController.validatePin);

router.get("/merchant/reports", customerController.fetchReport)

router.get("/customer", customerController.getCustomers)

router.get("/merchant/customer/:merchantId", customerController.getMerchantCustomer)



module.exports = router;