"use strict"



/**
Business Type
Company Registration Number
Physical Business Address
Nearest Landmark
City
Country
Website
Certificate of Incorporation, 
Directors’ Particulars, 
MemART/Statut (only for LLC & PLC), 
Utility Bill/Proof of business address 
*/
const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");

const Schema    = mongoose.Schema({
    userId: {type: String, require: true},
    businessType: {type: String, require: true},
    regNumber: {type: String, require: true},
    address: {type: String, require: true},
    landmark: {type: String, require: true},
    city: {type: String, require: true},
    country: {type: String, require: true},
    website: {type: String, require: true},
    coi: {type: String, require: true},
    memArt: {type: String, require: false},
    dp: {type: String, require: true},
    poba: {type: String, require: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date}
}, 
{
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id
            delete ret._v;
            delete ret._id;
        }
    }
});

Schema.index({"$**":"text"});
Schema.plugin(mongoosePaginate);
const Credential =  mongoose.model("Credential", Schema)


module.exports = Credential;
