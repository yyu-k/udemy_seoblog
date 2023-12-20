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
   blog.postedBy = req.auth._id //made available by a middleware in the route - require_sign_in

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