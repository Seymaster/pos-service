"use strict";

const Customer = require("./Customer");
const Repository = require("./MongodbRespository");

class CustomerRepository extends Repository{
    constructor(){
        super(Customer)
    }

    nonMetaFields(){
        return ["userId","phoneNumber"]
    }
}

module.exports = (new CustomerRepository());