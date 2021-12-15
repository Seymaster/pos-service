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
const merchantController = require("../controllers/merchant")
const customerController = require("../controllers/customer")
// const schemas = require("../middleware/schemas");
// const { validate } = require("../middleware/helper");


router.post("/merchants",  merchantController.createMerchant)
// validate(schemas.eventSchema.eventPost, 'body')

// To get all transactions by MechantId/customerId
router.get("/transactions", customerController.getTransaction)

// router.get("/graph", merchantController.fetchGraphData)

router.get("/merchants", merchantController.fetchMerchant)

router.post("/merchant/withdraw", merchantController.merchantWithdraw)

module.exports = router;