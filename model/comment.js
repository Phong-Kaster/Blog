const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
{
    articleID:String,
    username:String,
    comment:String,
    date:
    {
      type:Date,
      default:Date.now
    },
});

module.exports = mongoose.model('comment',commentSchema);