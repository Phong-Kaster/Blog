const mongoose = require('mongoose');

const categoryScheme = new mongoose.Schema({
    field:String,// o to
    seo:String//o-to
  });

module.exports = mongoose.model('category',categoryScheme);