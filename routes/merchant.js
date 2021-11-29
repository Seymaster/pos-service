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
// const schemas = require("../middleware/schemas");
// const { validate } = require("../middleware/helper");


router.post("/merchant",  merchantController.createMerchant)
// validate(schemas.eventSchema.eventPost, 'body')

router.get("/report", merchantController.fetchKpis)

router.get("/graph", merchantController.fetchGraphData)

router.get("/merchant", merchantController.fetchMerchant)

module.exports = router;