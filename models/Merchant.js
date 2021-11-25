"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");

const Schema    = mongoose.Schema({
    userId: {type: String, require: true},
    name: {type: String, require: true},
    paymentId: {type: String, require: true, unique: true},
    industry: {type: String, require: true},
    email: {type: String, require: true},
    phoneNumber: {type: String, require: true},
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
const Merchant =  mongoose.model("Merchant", Schema)



module.exports = Merchant;