const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI ||'mongodb:27017/cache'); //issue with docker image crashing

//local host docker test
mongoose.connect('mongodb://mongo:27017/cache');

//local host test
// mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:27017/cache');


module.exports = {mongoose};