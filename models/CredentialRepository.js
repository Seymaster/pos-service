"use strict";

const Credential = require("./Credential");
const Repository = require("./MongodbRespository");

class CredentialRepository extends Repository{
    constructor(){
        super(Credential)
    }

    nonMetaFields(){
        return ["userId","phoneNumber"]
    }
}

module.exports = (new CredentialRepository());