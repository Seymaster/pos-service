"use strict";

const Merchant = require("./Merchant");
const Repository = require("./MongodbRespository");

class MerchantRepository extends Repository{
    constructor(){
        super(Merchant)
    }

    nonMetaFields(){
        return ["userId","name","industry","otherName","sex","dateOfBirth"]
    }
}

module.exports = (new MerchantRepository());