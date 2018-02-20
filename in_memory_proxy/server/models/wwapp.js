const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var AppSchema = new mongoose.Schema({
    wwapp_id: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    wwapp_jwt: {
        type: String,
        minlength: 5
    }

});

AppSchema.methods.toJSON = function () {
    var wwapp = this;
    var wwappObject = wwapp.toObject();

    return _.pick(wwappObject, ["_id", "wwapp_id", "wwapp_jwt"]);
};

//modify this method to check tokem is valid and or get new token

AppSchema.methods.generateAuthToken = function () {
    var wwapp = this;
    var access = 'auth';
    var token = jwt.sign({_id: wwapp._id.toHexString(), access}, '123abc').toString();

    wwapp.tokens.push({access, token});

    return wwapp.save().then(() => {
        return token;
    });
};

AppSchema.statics.findByToken = function (wwappId) {
    var WWApp = this;


    return WWApp.findOne({
        'wwapp_id': wwappId
    });

};

var WWApp = mongoose.model('WWapp', AppSchema);

module.exports = {WWApp};