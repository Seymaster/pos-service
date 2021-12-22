"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");

const Schema    = mongoose.Schema({
    pin: {type: String, require: true},
    phoneNumber: {type: String, require: true},
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
}
);
Schema.index({"$**":"text"});
Schema.plugin(mongoosePaginate);
const Pin =  mongoose.model("Pin", Schema)


module.exports = Pin;