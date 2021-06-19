const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {
        name:String
    }
);

module.exports = mongoose.model('role',roleSchema);