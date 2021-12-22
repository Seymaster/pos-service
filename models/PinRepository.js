"use strict";

const Pin = require("./Pin");
const Repository = require("./MongodbRespository");

class PinRepository extends Repository{
    constructor(){
        super(Pin)
    }

    nonMetaFields(){
        return ["pin","phoneNumber"]
    }
}

module.exports = (new PinRepository());