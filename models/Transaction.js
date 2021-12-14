"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");

const Schema    = mongoose.Schema({
    reference: {type: String, require: false, default: null},
    productId: {type: String, require: false, default: null},
    customerId: {type: String, require: true},
    phoneNumber: {type: String, require: true},
    paymentCode: {type: String, require: true},
    amount: {type: Number, required: true},
    merchantId: {type: String, require: true},
    status: {type: String, require: false, default: "Failed"},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: null}
}, 
{
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id
            delete ret._v;
            delete ret._id;
        }
    }
}
);
Schema.index({"$**":"text"});
Schema.plugin(mongoosePaginate);
const Transaction =  mongoose.model("Transaction", Schema)



module.exports = Transaction;