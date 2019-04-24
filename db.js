const mongoose = require('mongoose');
const connectionString = 'mongodb+srv://admin:toan12031997@cluster0-dkfup.mongodb.net/test?retryWrites=true'
const connectionStringLocal = 'mongodb://localhost:27017/myapp';
mongoose.connect(connectionString, {useNewUrlParser: true});

module.exports = mongoose;
