const mongoose = require('mongoose');

let category = [
    "604f5e6aa417468c0da8b31b",// âm nhạc
    "604f5e7ca417468c0da8b31c",// thể thao
    "604f5eada417468c0da8b31e",// game
    "604f5ee70608e4b9dd149cca",// lập trình
    "604f5ef60608e4b9dd149ccb",// ô tô - xe máy
    "604f5f020608e4b9dd149ccc",// thiết bị âm thanh
    "60a26cb2f58613f60d08e0a1" // đời sống
  ];
  
  
  /*=======================================
  *          REGEX FOR EACH CATEGORY
  =======================================*/
  let regexMusic = /(.|)+(Âm nhạc)|(âm nhạc)|(Ca sĩ)|(ca sĩ)|(nhạc)|(Nhạc)|(Album)|(Spotify)+(.|)/;
  let regexSport = /(.|)+(thể thao)|(huy chương)+(.|)/;
  let regexGame = /(.|)+(game)|(Game)|(Console)|(console)|(trò chơi)|(playstation)+(.|)/;
  let regexProgramming = /(.|)+(lập trình)|(Lập trình)|(dev)|(deverloper)|(coder)|(Coder)+(.|)/
  let regexCar = /(.|)+(Ô tô)|(Tốc độ)|(tốc độ)|(ô tô)|(xế hộp)|(xe hơi)|(xe)|(Ford)|(Hyundai)|(Toyota)+(.|)/;
  let regexAudio = /(.|)+(Loa)|(loa)|(tai nghe)|(Tai nghe)|(iTune)|(Apple Music)|(Âm thanh)|(âm thanh)|(nhạc)|(true wireless)|(máy trợ thính)|(ear)+(.|)/
 
  
  module.exports.classify = function(messenge)
  {
    let result;//mongoose.Types.ObjectID("60a26cb2f58613f60d08e0a1")
         if( regexMusic.test(messenge))
        result = mongoose.Types.ObjectId(category[0]);
    else if( regexSport.test(messenge))
        result = mongoose.Types.ObjectId(category[1]);
    else if( regexGame.test(messenge))
        result = mongoose.Types.ObjectId(category[2]);
    else if( regexProgramming.test(messenge))
        result = mongoose.Types.ObjectId(category[3]);
    else if( regexCar.test(messenge))
        result = mongoose.Types.ObjectId(category[4]);
    else if ( regexAudio.test(messenge))
        result = mongoose.Types.ObjectId(category[5]);
    else
        result = mongoose.Types.ObjectId(category[6]);
    return result;
  }