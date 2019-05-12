const express = require('express');
const router = express.Router();
const CategoryModel = require('../../model/categoryModel');
const BlogModel = require('../../model/blogModel');
const Constant = require('../../constant')
const EmailModel = require('../../model/emailModel');

router.get('/', async (req, res) => {
    var page = req.query.page;
    if (page == "" || page == null || page == undefined) {
        page = Constant.DEFAULT_PAGE;
    }
    var search = req.query.search;
    var pageSize = Constant.PAGE_SIZE;
    var blogs = null;
    var allBlogs = null;

    //implement search for blogs
    if (search != null) {
        // blogs = await BlogModel.find({ title : { $regex :  search, $options : 'i' } } ).skip((parseInt(page)-1)* pageSize).limit(pageSize);
        allBlogs = await BlogModel.find({ title: { $regex: search, $options: 'i' } });
        blogs = allBlogs.slice(parseInt(page - 1) * pageSize, parseInt(page) * pageSize).reverse();
    } else {
        // blogs = await BlogModel.find().skip((parseInt(page)-1)* pageSize).limit(pageSize);
        allBlogs = await BlogModel.find();
        blogs = allBlogs.slice(parseInt(page - 1) * pageSize, parseInt(page) * pageSize).reverse();
    }
    //get newest blogs
    var nblogs = await BlogModel.find();
    var newestBlogs = nblogs.reverse().slice(0, 3);
    res.render('public/home', {
        blogs: blogs,
        numberofSize: allBlogs.length,
        page: page,
        pageSize: pageSize,
        search: search,
        newestBlogs: newestBlogs
    })

})

router.get('/category/:id', async (req, res) => {
    var page = req.query.page;
    if (page == "" || page == null || page == undefined) {
        page = Constant.DEFAULT_PAGE;
    }
    var pageSize = Constant.PAGE_SIZE;
    var blogs = null;
    var allBlogs = null;
    var cate = await CategoryModel.findOne({ id: req.params.id });
    var allBlogs = await BlogModel.find({ category: cate.title });
    blogs = allBlogs.slice(parseInt(page - 1) * pageSize, parseInt(page) * pageSize);
    res.render('public/category', {
        blogs: blogs,
        numberofSize: allBlogs.length,
        page: page,
        pageSize: pageSize,
        cateID: cate.id
    })

})

router.get('/series', async (req, res) => {
    var page = req.query.page;
    var series = req.query.series;
    if (page == "" || page == null || page == undefined) {
        page = Constant.DEFAULT_PAGE;
    }
    var pageSize = Constant.PAGE_SIZE;
    var blogs = null;
    var allBlogs = null;
    var allBlogs = await BlogModel.find({ series: series });
    blogs = allBlogs.slice(parseInt(page - 1) * pageSize, parseInt(page) * pageSize);
    res.render('public/series', {
        blogs: blogs,
        numberofSize: allBlogs.length,
        page: page,
        pageSize: pageSize,
        series: series
    })

})

router.get('/header', async (req, res) => {
    var cates = await CategoryModel.find();
    var series = await BlogModel.aggregate([{ $group: { _id: '$series', "count": { "$sum": 1 } } }, { $sort: { "count": -1 } }]).limit(10);
    res.status(200);
    res.json({ cates: cates, series: series })
})

router.get('/banner', async(req,res)=>{
    var listquotes = Constant.QUOTE;
    var id = Math.floor(Math.random()*6);
    res.json({ quote: listquotes[id]});
})

router.get('/detail/:id', async (req, res) => {
    var id = req.params.id;
    var blog = await BlogModel.findById(id);
    if (blog != null) {
        await BlogModel.updateOne({_id: id}, {'$inc': {'meta.fav': 1}});
        res.render('public/detail', {
            blog: blog
        })
    
    } else {
        res.render('public/error')
    }
})

router.post('/emailregister', async(req,res)=>{
    var email = req.body.email;
    var registedEmail = await EmailModel.findOne({"email": email});
    if(registedEmail == null || registedEmail == undefined){
        await EmailModel.create({"email": email});
        let message = Constant.EMAIL_REGISTER_SUCCESS;
        res.render("public/email",{message: message});
    }else{
        let message = Constant.EMAIL_REGISTER_FAIL;
        res.render("public/email",{message: message});
    }
})



module.exports = router;