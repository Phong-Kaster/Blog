const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email:String,
        password:String,
        name:String,
        role:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'role'
        }
    }
);

module.exports = mongoose.model('user',userSchema);