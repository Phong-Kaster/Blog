/*===========================LIBRARY==============================*/
var express = require('express');
var md5 = require('md5');
var router = express.Router();
const mongoose = require('mongoose');
var urlify = require('urlify').create({
  addEToUmlauts:true,
  szToSs:true,
  spaces:"-",
  nonPrintable:"-",
  trim:true
});

/*============================SCHEMA MODULES============================*/
const userSchema = require('../model/users.js');
const categorySchema = require('../model/category.js');
const articleSchema = require('../model/article.js');
const menuSchema = require('../model/menu.js');
const moment = require('moment');
const { json } = require('express');
const { title } = require('process');
const adminRole = "60b356ef907fbf636ab16750";


/*============================WELCOME TO ADMINSTATOR============================*/
router.get('/', function(req, res, next) {
  res.render('index', {title:'Adminstrator'});
});

/**===================================
 *          DASHBOARD - HOME 
 ===================================*/
router.get('/dashboard', function(req, res, next){
    res.render('admin/dashboard', {
      user: req.user,messenger : ""
    });
});
/**===================================
 *              MENUS
 ===================================*/
router.get('/menus', async function(req, res, next) 
{
  if( req.user.role != adminRole )
  {
    res.render('admin/dashboard.ejs', { user : req.user, messenger: "You do not have authorization !"});
  }

  let myMenus = await menuSchema.find({});
  res.render('admin/pages/menus/menus.ejs',{myMenus : myMenus});
});

router.post('/menus', function(req,res,next)
{
  let json_data = req.body;
  for(var i in json_data)
  {
    menuSchema.updateOne({ _id:json_data[i].id },
      {
        "href":json_data[i].href,
        "parent":""
      },
      function (err,menu)
      {
        if( err == null)
        {
          console.log(json_data[i].id + " is updated successfully");
        }  
      });
      let children = json_data[i].children
      for( var j in children)
      {
        menuSchema.updateOne({ _id:children[j].id},
          {
            "href":children[j].href,
            "parent":json_data[i].id
          },
          function (err)
          {
            if( err == null)
            {
              console.log(json_data[i].id + " children are updated successfully");
            }  
          });
      }
  }
});
/**===================================
 *         BASIC UI ELEMENTS
 ===================================*/
router.get('/buttons', function(req, res, next) {
  res.render('admin/pages/ui-features/buttons' ,{ user : req.user });
});

router.get('/dropdowns', function(req, res, next) {
  res.render('admin/pages/ui-features/dropdowns',{ user : req.user });
});

router.get('/typography', function(req, res, next) {
  res.render('admin/pages/ui-features/typography',{ user : req.user });
});

/**===================================
 *             ADD ARTICLE
 ===================================*/
 router.get('/add-article', function(req, res, next) {
  categorySchema.find( {}, function(err,myCategories)
  {
    if( myCategories != null)
    {
      res.render('admin/pages/forms/add-article' , 
      { 
        myCategories : myCategories ,
        message:req.flash('message'),
        user : req.user
      });
    }
    else
    {
      console.log(err);
    }
  });
});
router.post('/add-article',function(req,res,next)
{

 let addingArticle = new articleSchema( {...req.body, seo:urlify(req.body.title)  } );
  addingArticle.save( function (err,newArticle)
  {
    console.log( newArticle );

    if(err == null)
    {
      req.flash('message','Added Successfully');
      res.redirect('/admin/add-article');
    }
    else
    {
      console.log(err);
    }
  })
})
/**===================================
 *             EDIT ARTICLE
 ===================================*/
 router.get('/edit-article/:idenArticle',async function(req, res, next) {

  let idenArticle = req.params.idenArticle;
  try {
    let editedArticle = await articleSchema.findOne( { _id:idenArticle} );
    if( editedArticle != null)
    {
      let myCategories = await categorySchema.find({});
      res.render('admin/pages/forms/edit-article', { 
        editedArticle:editedArticle , 
        myCategories:myCategories,
        user : req.user 
      });
    }
    else
    {
      res.redirect('/add-article');
    }
  } 
  catch (error) 
  {
    res.redirect('/add-article');
  }
});

router.post('/edit-article/:idenArticle',function(req, res, next) {
  // let editedArticle = new articleSchema( {...req.body, seo:urlify(req.body.title)  } );

  let idenArticle = req.params.idenArticle;
  let title = req.body.title;
  let seo = urlify( req.body.title );
  let pathPhoto = req.body.pathPhoto;
  let content = req.body.content;
  let category = req.body.category;
  let description = req.body.description;
  
  articleSchema.findByIdAndUpdate(
  { _id : idenArticle },
  {
        "title":title,
        "seo":seo,
        "pathPhoto":pathPhoto,
        "content":content,
        "category":category,
        "description":description
  },
  function(err , editedArticle )
  {
    
    if( err == null && editedArticle != null)
    {
      console.log('Updated Successfully');
      res.redirect('/admin/list-articles');
    }
    else
    {
      console.log(err);
    }
  })
  
});
/**===================================
 *             DELETE ARTICLE
 ===================================*/
 router.get('/delete-article/:idenArticle',async function(req, res, next) {

  let idenArticle = req.params.idenArticle;
  articleSchema.findOneAndRemove({ _id: idenArticle}, function(err, user) {

      if (err) throw err;

      console.log("Success");
  });

  res.redirect('/admin/list-articles',{user : req.user});
});
/**===================================
 *             CHARTS
 ===================================*/
 router.get('/charts', function(req, res, next) {
  res.render('admin/pages/charts/chartjs',{user : req.user});
});
/**===================================
 *             LIST-ARTICLES
 ===================================*/
 router.get('/list-articles', function(req, res, next) {
  if( req.user.role != adminRole )
  {
    res.render('admin/dashboard.ejs', { user : req.user, messenger: "You do not have authorization !"});
  }

  let page = req.query.page ? parseInt( req.query.page ) : 1;
  articleSchema.countDocuments(function(err,count)
  {
    let numberOfpage = Math.ceil( count / 10 );
    articleSchema.find({})
   .skip( ( page == 1 ? 0 : (page-1) ) * 10)
   .limit(10)
   .populate( 'category',{ _id:0 , field:1})
   .sort({datefield: -1})
   .exec(function(err,myArticles)
   {
      if( err == null)
      {
        res.render('admin/pages/forms/list-articles.ejs', 
        {
          myArticles:myArticles,
          moment:moment,
          numberOfpage:numberOfpage,
          page:page,
          user:req.user
        });
      }
      else
      {
        console.log(err);
      }
    
   });
  });
});
/**===================================
 *             LIST-CATEGORIES
 ===================================*/
 router.get('/list-categories', function(req, res, next) {

  /**
   * Check if current user is a Admin or a Moderator
   */
  let userCookie = req.cookies.user ? req.cookies.user.split("_") : [];
  //Lay ra ID User
  let idenUser = userCookie[0];
  userSchema.findOne( { _id : idenUser })
  .then( function ( target )
  {
      if( target.role != adminRole )
      {
        res.render('admin/dashboard.ejs',{user : req.user , messenger : "You do not have authorization !"})
      }
  })

  //let page = req.query.page ? parseInt( req.query.page ) : 1;
  categorySchema.find({},function(err, myCategories)
  {
    if( err == null && myCategories != null)
    {
      res.render('admin/pages/forms/list-categories.ejs',
      {
        myCategories : myCategories,
        moment:moment,
        user : req.user
      });
    }
    else
    {
      console.log(err);
    }
  })
});
/**===================================
 *             ADD CATEGORY   
 ===================================*/
 router.get('/add-category', function(req, res, next) {

   /**
   * Check if current user is a Admin or a Moderator
   */
    let userCookie = req.cookies.user ? req.cookies.user.split("_") : [];
    //Lay ra ID User
    let idenUser = userCookie[0];
    userSchema.findOne( { _id : idenUser })
    .then( function ( target )
    {
        if( target.role != adminRole )
        {
          res.render('admin/dashboard.ejs',{user : req.user , messenger : "You do not have authorization !"})
        }
        else
        {
          res.render('admin/pages/forms/add-category',{user : req.user});
        }
    })

  
});
 router.post('/add-category',function(req, res, next) {
  let addingCategory = new categorySchema( { ...req.body } );
  addingCategory.save( function(error, newCategory)
  {
    if( error == null && newCategory != null)
    {
      console.log("Added Successfully !!");
      res.redirect('/admin/add-category');
    }
  } );
});
/**===================================
 *             EDIT CATEGORY   
 ===================================*/
 router.get('/edit-category/:idenCategory', function(req, res, next) {
  let idenCategory = req.params.idenCategory;
  categorySchema.findOne( { _id : idenCategory }, function( err, editingCategory)
  {
    if( err == null && editingCategory != null)
    {
      res.render('admin/pages/forms/edit-category',
      {
        editingCategory:editingCategory,
        user : req.user
      });
    }
    else
    {
      console.log(err);
    }
  })
});
router.post('/edit-category',function(req,res,next)
{
  let editingCategory = new categorySchema({...req.body});

  edittingCategory.save( function(err,edittingCategory)
  {
    if( err == null && editingCategory != null)
    {
      console.log('Updated Successfully !!!');
    }
    else
    {
      console.log(err);
    }
  });
});
/**===================================
 *             DELETE CATEGORY
 ===================================*/
 router.get('/delete-category/:idenCategory', function(req, res, next) {
  let idenCategory = req.params.idenCategory;
  categorySchema.findOneAndRemove({ _id: idenCategory}, function(err, user) {

      if (err) throw err;

      console.log("Deleted Successfully !!");
  });

  res.redirect('/admin/list-categories',{user : req.user});
});
/**===================================
 *             ICON   
 ===================================*/
 router.get('/icons', function(req, res, next) {
  res.render('admin/pages/icons/font-awesome',{user : req.user});
});

/**===================================
 *             USER PAGES
 ===================================*/
 router.get('/blank-page', function(req, res, next) {
  res.render('admin/pages/samples/blank-page',{user : req.user});
});
/**===================================
 *             LOGIN
 ===================================*/
router.get('/login',function(req, res, next) {
    res.render('admin/pages/samples/login', { 
      user : req.user, 
      messenger:req.flash('messenger')
    });
});
router.post('/login', function(req, res, next) {
  let iEmail = req.body.email;
  let iPassword = req.body.password;
  
  userSchema.findOne( { email:iEmail } , function(err,target)
  {
    if( target != null )
    {
      if( target.password == iPassword)
      {
        res.cookie( 'user',target._id + "_" +md5(target.email+"_"+target.password));
        res.redirect('/admin/dashboard');
      }
      else
      {
        req.flash('messenger','incorrect username or password');
        res.redirect('/admin/login');
      }
    }
    else
    {
      req.flash('messenger','incorrect username or password');
      res.redirect('/admin/login');
    }
  })

});

/**===================================
 *             SIGN OUT
 ===================================*/
 router.get('/signout',function(req, res, next) {
  res.clearCookie("user");
  res.redirect('/admin/login');
});

router.get('/register', function(req, res, next) {
  res.render('admin/pages/samples/register',{user : req.user});
});
router.get('/error-404', function(req, res, next) {
  res.render('admin/pages/samples/error-404',{user : req.user});
});
router.get('/error-500', function(req, res, next) {
  res.render('admin/pages/samples/error-500',{user : req.user});
});
module.exports = router;