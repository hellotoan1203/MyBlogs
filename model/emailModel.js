const database = require('../db');

var Schema = database.Schema;

var emailSchema = new Schema({
    email: String
})

var emailModel = database.model('RegistedEmail',emailSchema,'EmailCollection');

module.exports = emailModel;