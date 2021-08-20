const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});
const Token = new mongoose.model('token', tokenSchema);
module.exports = Token;
