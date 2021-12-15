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
// const schemas = require("../middleware/schemas");
// const { validate } = require("../middleware/helper");


router.post("/pay/initiate",  customerController.initiatePayment)
// validate(schemas.eventSchema.eventPost, 'body')

router.get("/customer", customerController.getCustomers)


module.exports = router;