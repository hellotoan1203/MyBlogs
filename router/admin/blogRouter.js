const express = require('express');
const router = express.Router();
const authen = require('../../midleware/authenMidleware');
const CategoryModel = require('../../model/categoryModel');
const BlogModel = require('../../model/blogModel');
const Constant = require('../../constant')


router.use(authen.authenticated);

router.get('/', (req, res) => {
    res.redirect('/admin/blog/list')
})

router.get('dashboard', (req, res) => {
    res.render('admin/DashBoard')
})

router.get('/edit/:id', async (req, res) => {
    var blog = await BlogModel.findById(req.params.id);
    var category = await CategoryModel.findOne({ title: blog.category });
    res.render('admin/EditBlog', {
        title: blog.title,
        category: category.id,
        author: blog.author,
        body: blog.body,
        description: blog.description,
        series: blog.series,
        id: blog._id,
        user: req.user.username,
        image: blog.img
    });
})

router.get('/edit', async (req, res) => {
    res.render('admin/EditBlog', {
        title: null,
        category: null,
        author: null,
        body: null,
        series: null,
        description: null,
        id: null,
        image: null,
        user: req.user.username
    })
})


router.get('/list', async (req, res) => {
    var page = req.query.page;
    var pageSize = Constant.PAGE_SIZE;
    if (page == "" || page == null || page == undefined || page ==0) {
        page = Constant.DEFAULT_PAGE;
    }
    
    var blogs = null;
    var allBlogs = null;
    var allBlogs = await BlogModel.find();
    var allPages = (allBlogs.length % pageSize == 0) ? (allBlogs.length / pageSize) : Math.round(allBlogs.length / pageSize)+1;
    if(allPages < page){
        page = 1
    }
    blogs = allBlogs.slice(parseInt(page - 1) * pageSize, parseInt(page) * pageSize);
    res.render('admin/ListBlogs', {
        list: blogs,
        user: req.user.username, 
        numberofSize: allBlogs.length,
        page: page,
        pageSize: pageSize
    })

})


router.post("/edit", async (req, res) => {
    var title = req.body.title;
    var series = req.body.series;
    var category = req.body.category;
    var body = req.body.editor;
    var author = req.body.author;
    var id = req.body.id;
    var image = req.body.image;
    var description = req.body.description;
    var cate = await CategoryModel.findOne({ id: parseInt(category) });
    if (id == null || id == "") {
        await BlogModel.create({
            title: title,
            series: series,
            category: cate.title,
            body: body,
            author: author,
            description: description,
            img: image
        });
        var result = await CategoryModel.updateOne({ id: parseInt(category) }, { $inc: { "number": 1 } });
        res.redirect('/admin/blog/list')
    } else {
        console.log(id)
        await BlogModel.findByIdAndUpdate(id, {
            title: title,
            series: series,
            category: cate.title,
            body: body,
            author: author,
            img: image,
            description: description
        })
        res.redirect('/admin/blog/list')
    }


})

module.exports = router;