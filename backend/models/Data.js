const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    date: Date,
    verified: String
})

const Data = new mongoose.model("data", dataSchema);
module.exports = Data;