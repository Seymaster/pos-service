"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");

const Schema    = mongoose.Schema({
    userId: {type: String, require: true},
    phoneNumber: {type: String, require: true},
    pin: {type: String, require: false, default: "0000"},
    createdAt: {type: Date, default: Date.now}
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
const Customer =  mongoose.model("Customer", Schema)


module.exports = Customer;