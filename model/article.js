const mongoose = require('mongoose');


const articleScheme = new mongoose.Schema({
    title: String,
    seo:String,
    pathPhoto:String,
    content:String,
    category:
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'category'
    },
    date:
    {
      type:Date,
      default:Date.now
    },
    description:String,
    gallery:Array
  });

module.exports = mongoose.model('article', articleScheme);