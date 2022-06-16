"use strict";

const Credential = require("./Credential");
const Repository = require("./MongodbRespository");

class CredentialRepository extends Repository{
    constructor(){
        super(Credential)
    }

    nonMetaFields(){
        return ["userId","businessType","regNumber","address","landmark","city","country","website","coi","memArt","dp","poba"]
    }
}

module.exports = (new CredentialRepository());