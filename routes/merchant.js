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
const schema = require("../middleware/schema");
const { validate } = require("../middleware/helper");


router.post("/merchants", validate(schema.merchantSchema.merchantPost, 'body'),  merchantController.createMerchant)


// To get all transactions by MechantId/customerId
router.get("/transactions", customerController.getTransaction)

// router.get("/graph", merchantController.fetchGraphData)

router.get("/merchants", merchantController.fetchMerchant)

router.post("/merchant/withdraw", merchantController.merchantWithdraw)

module.exports = router;