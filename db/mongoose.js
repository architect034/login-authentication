var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/LoginAuthentication'); //database connection

module.exports = {
    mongoose: mongoose
}