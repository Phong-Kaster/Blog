var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');;
var convertObjectId = require('mongodb').ObjectId;
var classify = require('../model/classify.js');
/*=============================================================================================
 *                SCHEME MODULE
 ==============================================================================================*/
const articleSchema = require('../model/article.js');
const categorySchema = require('../model/category.js');
const commentSchema = require('../model/comment.js');
const menuSchema = require('../model/menu.js');
/*=============================================================================================
 *                    ROUTER
 ==============================================================================================*/
router.get('/', function(req, res, next)
{
  res.render('index', { title: 'Express' });
});

/**=========================
 * LOAD PAGE BY CATEGORY
 =========================*/
 router.get('/the-loai', function(req, res, next)
 {
   res.redirect('/home');
 });

router.get('/the-loai/:category', function(req, res, next)//am-nhac
{
  let category = req.params.category;
  let page = req.query.page ? parseInt( req.query.page ) : 1;
  categorySchema.findOne( { _id:category }, function( err, category)
  {
    if( category != null)
    {
      articleSchema.countDocuments( { category:category } , function ( err , count)
      {
        let numberOfpage = Math.ceil( count / 5 );
      
        articleSchema.find( { category:category })
        .skip( (page == 1 ? 0 : page-1)*5)
        .limit(5)
        .exec(function(err,myArticles)
          {
            categorySchema.find( {},function(err,myCategories)
            {
              if( err == null && myArticles.length == 0 )
                {
                  res.redirect('/blog');
                }
              if(err == null && myArticles.length != 0)
              {
                  res.render('theme/category',
                  {
                    myArticles:myArticles,
                    myCategories:myCategories,
                    title:'Weblog',
                    moment:moment,
                    numberOfpage:numberOfpage,
                    page:page
                  })
              }
              else
              {
                console.log(err);
              }
            });
          });

        });
    }
    else
    {
      console.log(err);
    }
  })
});
/**=========================
 * LOAD PAGE BY ARTICLE'S IDEN
 =========================*/
router.get('/*.:idenArticle',async function(req, res, next)
{
  let idenArticle = req.params.idenArticle;
  let myArticles = await articleSchema.find({});
  // get 5 lastest comments from mongoDB
  let commentsArticle = await commentSchema.find({ articleID:idenArticle }).limit(5).sort({$natural:-1});
    articleSchema.findOne( { _id:idenArticle } , function( err, myArticle )
    {
      categorySchema.find( { } , function(err,myCategories)
      { 
        if( err == null)
        {
          res.render( 'theme/single',
          { 
            myArticle:myArticle,
            myCategories:myCategories,
            myArticles:myArticles,
            moment:moment,
            commentsArticle:commentsArticle
          });
        }
        else
        {
          console.log(err);
        }
      });
    });
});
/**=========================
 *           CONTACT
 =========================*/
 router.get('/contact', function(req, res, next)
 {
   articleSchema.find({},function(err,myArticles)
   {
     categorySchema.find({},function(err,myCategories)
     {
       if(err == null)
       {
         res.render('theme/contact' , 
         {
           myCategories:myCategories,
           myArticles:myArticles,
           title:'Contact',
           moment:moment
         });
       }
       else
       {
         console.log(err);
       }
     });
   });
 });
/**=========================
 *           BLOG
 =========================*/
router.get('/blog',async function(req, res, next)
{
  
  let page = req.query.page ? parseInt( req.query.page ) : 1;
  let lastestArticles = await articleSchema.find({}).sort({$natural:-1}).limit(3);
  console.log(lastestArticles);
  articleSchema.countDocuments( function( err, count)
  {
    let numberOfpage = Math.ceil(count / 5);
    
    articleSchema.find({})
    .skip((page == 1 ? 0 : page-1)*5)
    .limit(5)
    .exec( function(err,myArticles)
    {
      categorySchema.find({},function(err,myCategories)
      {
        if(err == null)
        {
          res.render('theme/blog',
          {
            myArticles:myArticles,
            myCategories:myCategories,
            moment: moment,
            numberOfpage:numberOfpage,
            title:'Blog',
            page:page,
            lastestArticles:lastestArticles
          });
        }
        else
        {
          console.log(err);
        }
      });
    });
  });
  
});

/**=========================
 *           HOME
 =========================*/
router.get('/home',async function(req, res, next)
{
    let myMenus = await menuSchema.find({});
    articleSchema.find({},function(err,myArticles)
    {
      categorySchema.find({},function(err,myCategories)
      {
        if(err == null)
        {
          res.render('theme/home',
          {
            myArticles:myArticles,
            myCategories:myCategories,
            moment: moment,
            title:'Trang chủ',
            myMenus:myMenus
          });
        }
        else
        {
          console.log(err);
        }
      });
    });
});
/**=========================
 *         DO COMMENT
 =========================*/
router.post('/do-comment/:articleID',function(req,res)
{
    let articleID = req.params.articleID;
    let username = req.body.username;
    let comment = req.body.comment;
    
    
    let newComment = new commentSchema(
      {
        articleID:articleID,
        username:username,
        comment:comment
      }
    );

    newComment.save(function (err,newComment) 
    {
      if( err == null && newComment != null)
      {
        // Sends a JSON response composed of the specified data. 
        res.json({
          username:newComment.username,
          comment:newComment.comment,
          date: moment(newComment.date).format('ddd, DD-mm-YYYY - h:mm a')
        });
      }
      else
      {
        console.log(err);
      }
      
    });
}); 
module.exports = router;
