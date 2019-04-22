const database = require('../db');

var Schema = database.Schema;

var blogSchema = new Schema({
    title: String,
    author: String,
    body: String,
    img: String,
    date: {type: Date, default: Date.now()},
    description: String,
    category: String,
    series: String,
    meta: {
        vote: {type: Number, default: 0},
        fav: {type: Number, default:0}
    }
});

var BlogModel = database.model('Blog', blogSchema,'BlogCollection');

module.exports = BlogModel
