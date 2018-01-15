const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var AppSchema = new mongoose.Schema({
    app_id: {
        type: String,
        required: true,
        // unique: true,
        minlength: 5
    },
    app_secret: {
        type: String,
        required: true
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

AppSchema.methods.toJSON = function () {
    var app = this;
    var appObject = app.toObject();

    return _.pick(appObject, ["_id", "app_id","app_secret"]);
};

AppSchema.methods.generateAuthToken = function () {
    var app = this;
    var access = 'auth';
    var token = jwt.sign({_id: app._id.toHexString(), access}, '123abc').toString();

    app.tokens.push({access, token});

    return app.save().then(() => {
        return token;
    });
};

AppSchema.statics.findByToken = function (token) {
    var App = this;
    var decoded;

    try {
        decoded = jwt.verify(token, '123abc');

    } catch (e) {
        // return new Promise((resolve, reject) =>{
        //    reject();
        // });
        return Promise.reject();

    }

    return App.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'

    });

};

var App = mongoose.model('App', AppSchema);

module.exports = {App};