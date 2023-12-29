const Blog = require('../models/blog_model');
const Category = require('../models/categories_model');
const Tag = require('../models/tag_model');

const formidable = require('formidable'); //deals with form based data
const { firstValues } = require('formidable/src/helpers/firstValues.js');
const { default: slugify } = require('slugify');
const _ = require('lodash');
const fs = require('fs');
const { stripHtml } = require('string-strip-html');


const { logger } = require('../backend_logger');
const { generateDBErrorMsg } = require('../helpers/generateDBErrorMsg');
const { smartTrim } = require('../helpers/smartTrim');

exports.create = (req,res) => {
  const form = new formidable.IncomingForm({
    keepExtensions : true
  });
  form.parse(req, (err, fields, files) => {
    if (err) {
        logger.info("formidable form.parse failed: " + err.message);
        return res.status(400).json({
            error : "formidable form.parse failed"
        })
    };
   //handle fields
   const {title, body, categories, tags} = firstValues(form, fields, []);

   //validation (cannot use express for this because this is not json)
   if (!title || !title.length) {
        return res.status(400).json({
            error :  'title is required'
        });
   };

   if (!body || body.length < 200) {
        return res.status(400).json({
            error :  'Body is either too short or non-existent'
        });
    };

    if (!categories || categories.length === 0) {
        return res.status(400).json({
            error :  'At least one category is required'
        });
    }

    if (!tags || tags.length === 0) {
        return res.status(400).json({
            error :  'At least one tag is required'
        });
    }

   const blog = new Blog();
   blog.title = title;
   blog.body = body;
   blog.slug = slugify(title, {lower : true});
   blog.metaTitle = `${title} | ${process.env.APP_NAME}`; 
   blog.metaDescription = stripHtml(body.substring(0, 160)).result; //first 160 characters
   blog.postedBy = req.auth._id; //made available by a middleware in the route - require_sign_in
   blog.excerpt = smartTrim(body, 320, ' ', ' ...');

   //handle categories and tags
   arrayOfCategories = categories.split(',');
   arrayOfTags = tags.split(',');

   //handle photo/files
   const { photo } = firstValues(form, files, []);
   if (photo) {
    if (photo.size > 10000000) { //validation to make sure photo less than 1 mb
        return res.status(400).json({
            error : 'Image should be less than 1 mb in size'
        });    
    }
    blog.photo.data = fs.readFileSync(photo.filepath) //fs is from Node.JS
    blog.photo.contentType = photo.mimetype;
   }

   blog.save()
   .then((data) => {
        //push categories and tags data to blog
        Blog.findByIdAndUpdate(
            data._id, 
            {$push : {categories : arrayOfCategories, tags : arrayOfTags}}, //not sure why this is pushed instead of just assigned directly?
            {new : true}
        )
        .exec()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            return res.status(400).json({
                error : generateDBErrorMsg(err)
            })
        })
   })
   .catch((err) => {
        logger.warn(err.message);
        res.status(400).json({
            error : generateDBErrorMsg(err)
        });
   })
  })
};

exports.list = (req, res) => {
    Blog.find({}) //find all
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username profile')
    .select('_id title slug excerpt categories tags postedBy createdAt updatedAt') //pictures and body should be handled separately
    .exec()
    .then((data) => {
        return res.json(data);
    })
    .catch((err) => {
        return res.status(400).json({
            error : generateDBErrorMsg(err)
        });
    });
}

exports.listBlogCatTag = (req, res) => {
    const limit = req.body.limit ? parseInt(req.body.limit) : 10 //number of posts/categories/tags to be loaded in one go
    const skip = req.body.skip ? parseInt(req.body.skip) : 0 //how many to skip i.e. already loaded
    const blogPromise = Blog.find({})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username profile')
    .sort({createdAt: -1}) //newest first
    .skip(skip)
    .limit(limit)
    .select('_id title slug excerpt categories tags postedBy createdAt updatedAt') //pictures and body should be handled separately
    .exec()

    const catPromise = 
        Category.find({})
        .exec()

    const tagPromise =
        Tag.find({})
        .exec()

    promiseArray = [blogPromise, catPromise, tagPromise]
    Promise.all(promiseArray)
        .then((dataArray) => {
            res.json({
                blogs : dataArray[0], 
                categories : dataArray[1], 
                tags : dataArray[2], 
                size : dataArray[0].length
            })
        })
        .catch((error) => {
            res.status(400).json({
                error : error.message
            })
        })
}

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({slug})
    .select('-photo') //exclude the photo field when reading
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username profile')
    .select('_id title body slug metaTitle metaDescription categories tags postedBy createdAt updatedAt') //pictures should be handled separately
    .exec()
    .then((data) => {
        res.json(data)
    })
    .catch((err) => {
        res.status(400).json({
            error : generateDBErrorMsg(err)
        })
    })
}

exports.getPhoto = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({slug})
    .select('photo')
    .exec()
    .then((blog) => {
        if (!blog) {
            return res.status(400).json({
                error : `No relevant blog found for the slug "${slug}"`
            })
        } else {
            res.set('Content-Type', blog.photo.contentType);
            return res.send(blog.photo.data)
        }
    })
    .catch((err) => {
        return res.status(400).json({
            error : generateDBErrorMsg(err)
        })
    })
}

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOneAndDelete({slug})
    .exec()
    .then((data) => {
        res.json({
            message : `Blog with title ${data.title} deleted successfully`
        })
    })
    .catch((err) => {
        res.status(400).json({
            error : generateDBErrorMsg(err)
        })
    })
}

exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({slug})
    .exec()
    .then((oldBlog) => {
        const form = new formidable.IncomingForm({
            keepExtensions : true
          });
          form.parse(req, (err, fields, files) => {
            if (err) {
                logger.info("formidable form.parse failed: " + err.message);
                return res.status(400).json({
                    error : "formidable form.parse failed"
                })
            };

           const {body, categories, tags, title} = firstValues(form, fields, []);
                      
           //handle merge
           //Note that slug should not change for SEO purpose
           
           //set new values in fields
            if (body) {
                fields.excerpt = smartTrim(body, 320, ' ', ' ...');
                fields.metaDescription = stripHtml(body.substring(0, 160));                
            };

            if (categories) { //categories and tags need special treatment because they are ararys, whereas the field is just a string
                fields.categories = categories.split(',');
            }

            if (tags) {
                fields.tags = tags.split(',');
            }

            if (title) {
                fields.title = title;
            }

            //merge
            oldBlog = _.merge(oldBlog, fields);
            //technically there should be some validation that if new fields are inserted, they still satisfy the old requirements
        
           //handle photo/files
           const { photo } = firstValues(form, files, []);
           if (photo) {
            if (photo.size > 10000000) { //validation to make sure photo less than 1 mb
                return res.status(400).json({
                    error : 'Image should be less than 1 mb in size'
                });    
            }
            oldBlog.photo.data = fs.readFileSync(photo.filepath) //fs is from Node.JS
            oldBlog.photo.contentType = photo.mimetype;
           }
        
           oldBlog.save()
           .then((data) => {
                res.json(data);
           })
           .catch((err) => {
                logger.warn(err.message);
                res.status(400).json({
                    error : generateDBErrorMsg(err)
                });
           })
          })
    })
    .catch((err) => {
        res.status(400).json({
            error : generateDBErrorMsg(err)
        })
    })
}

exports.listRelated = (req, res) => {
    const limit = req.body.limit ? parseInt(req.body.limit) : 3;
    const {_id, categories} = req.body.blog;
    Blog.find({ _id: {$ne: _id}, categories: {$in: categories}})
    .limit(limit)
    .populate('postedBy', '_id name profile')
    .select('title slug excerpt postedBy createdAt updatedAt')
    .exec()
    .then((blogs) => {
        res.json(blogs)
    })
    .catch((err) => {
        res.status(400).json({
            error : err.message
        })
    })
}