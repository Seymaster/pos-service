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
const credentialController = require("../controllers/credential")
const schema = require("../Middleware/schema");
const { validate } = require("../Middleware/helper");


router.post("/credentials", validate(schema.credentialSchema.credentialPost, 'body'),  credentialController.createCredential)


router.get("/credentials", credentialController.fetchCredential)

module.exports = router;