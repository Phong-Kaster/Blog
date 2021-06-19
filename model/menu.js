const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
    {
        name:String,
        href:String,
        parent:String
    }
)

module.exports = mongoose.model('menu',menuSchema);