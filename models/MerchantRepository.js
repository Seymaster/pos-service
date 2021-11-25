"use strict";

const Merchant = require("./Merchant");
const Repository = require("./MongodbRespository");

class MerchantRepository extends Repository{
    constructor(){
        super(Merchant)
    }

    nonMetaFields(){
        return ["userId","name","industry","email","phoneNumber"]
    }
}

module.exports = (new MerchantRepository());