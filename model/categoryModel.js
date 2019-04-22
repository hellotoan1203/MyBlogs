const database = require('../db')

var Schema = database.Schema;

var categorySchema = new Schema({
    title: String,
    id: Number,
    number: {type:Number, default: 0}
})

var categoryModel = database.model('Category',categorySchema, 'CategoryCollection');

module.exports = categoryModel

