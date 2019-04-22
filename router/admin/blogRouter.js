const express = require('express');
const router = express.Router();
const authen = require('../../midleware/authenMidleware');
const CategoryModel = require('../../model/categoryModel');
const BlogModel = require('../../model/blogModel');


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
    var listBlog = await BlogModel.find();
    res.render('admin/ListBlogs', {
        list: listBlog,
        user: req.user.username
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