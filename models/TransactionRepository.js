"use strict";

const Transaction = require("./Transaction");
const Repository = require("./MongodbRespository");

class TransactionRepository extends Repository{
    constructor(){
        super(Transaction)
    }

    nonMetaFields(){
        return ["reference","customerId","phoneNumber","paymentCode","merchantId","status"]
    }
}

module.exports = (new TransactionRepository());