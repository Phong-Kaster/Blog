/*===========================LIBRARY==============================*/
var classifyCategory = require('./model/classify.js');
const rp = require("request-promise");
const mongoose = require('mongoose');
const cheerio = require("cheerio");
const fs = require("fs");
const URL = `https://tinhte.vn/`;
const options = {
  uri: URL,
  transform: function (body) {
    return cheerio.load(body);
  },
};
const cron = require('node-cron');
mongoose.connect('mongodb://localhost/weblog', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We connected to "weblog" database successfully !! ');
});

/*===========================LIBRARY==============================*/
const articleSchema = require('./model/article.js');
/*============================REGEX============================*/
let regexUselessURL = /https.+home_latest_thread_subbrand_logo/;
let regexTitleFilter = /(Tâm sự)|(QC)|(qc)|(Infographic)|(Tổng hợp game)|(Tổng hợp deal khuyến mãi).+/;
/*============================FUNCTION============================*/
function toSeoUrl(url)
{
  return url.toString()               // Convert to string
      .normalize('NFD')               // Change diacritics
      .replace(/[\u0300-\u036f]/g,'') // Remove illegal characters
      .replace(/\s+/g,'-')            // Change whitespace to dashes
      .toLowerCase()                  // Change to lowercase
      .replace(/&/g,'-and-')          // Replace ampersand
      .replace(/[^a-z0-9\-]/g,'')     // Remove anything that is not a letter, number or dash
      .replace(/-+/g,'-')             // Remove duplicate dashes
      .replace(/^-*/,'')              // Remove starting dashes
      .replace(/-*$/,'');             // Remove trailing dashes
}

/*============================UPDATE ARTICLES AUTOMATICALLY============================*/
/* This async function CRAWLER will ignore all posts have features below:
 * (1)the phase "home_latest_thread_subbrand_logo" exists in the URL 
 * (2)All phase "tâm sự","QC","qc","Infographic" exist  in the Title
 * (3)Title is empty
 * (4)Description is empty
 * (5)The post has NO cover photo
 */
cron.schedule('* * * * *', function() 
{
  (async function crawler() 
  {
    try 
    {
      var $ = await rp(options);
    } 
    catch (error) 
    {
      return error;
    }
 
 
  
  /**=================================================================
   * tableLink gets all <a> tag in the first line of class "article"
   =================================================================*/
  const tableLink = $("article.jsx-962700794 a:first-child");
  console.log("THERE ARE "+tableLink.length+" LINKS");



  /**=================================================================
   *                tableContent gets all <li> tag
   =================================================================*/
   const tableContent = $(".jsx-1666688243 li");

  for (let i = 0; i < tableLink.length; i++)
  {
      let chaperLink = tableLink[i].attribs.href;
      if( regexUselessURL.test(chaperLink) == true)
          continue;
          
      let chaper = $(tableContent[i]);
      let chaperTitle = chaper.find("div.jsx-962700794 h3").text().trim();
      let chaperDescription = chaper.find("div.jsx-962700794 p").text();
      
      
      if( regexUselessURL.test(chaperLink) == false &&
          chaperTitle !== "" && 
          chaperDescription !== "")
      {
        let URL = chaperLink;
        const options = 
        {
          uri: URL,
          transform: function (body)
          {
            return cheerio.load(body);
          }
        };
       
        
        try 
        {
          var $ = await rp(options);
        } 
        catch (error) 
        {
          return error;
        }

        let iTitle = $("div.jsx-1378818985.thread-title").text().trim();
        let iSeo = toSeoUrl(iTitle);
        let iContent =  $("div.jsx-1689703282.xfBody.big").text().replace(/(\n\n|\t)/g,'');
        let iPhotos = $("span.bdImage_attachImage").find("img");
        let iCoverPhotos = $("div.jsx-1378818985.thread-cover.false").find("img");
        let iCategory = classifyCategory.classify(iTitle);
        let iGallery = [];

        if(iCoverPhotos.length == 0 || regexTitleFilter.test(iTitle) == true)
        {
            continue;
        }

        for(let j = 0 ;j < iPhotos.length;j++)
        {
          iGallery.push(iPhotos[j].attribs.src);
        }
        new articleSchema(
        {
          "title":iTitle,
          "seo":iSeo,
          "pathPhoto":iCoverPhotos[0].attribs.src,
          "content":iContent,
          "category":iCategory,
          "description":chaperDescription,
          "gallery" : iGallery
        }).save(function (err) {
                  if( err == null )
                      console.log("Added");
                  else
                      console.log(err);
              });
      }

  }
  console.log("NOTICE : Crawled successfully");

  // Lưu dữ liệu về máy
  //fs.writeFileSync('data.json', JSON.stringify(data))
  })()
});