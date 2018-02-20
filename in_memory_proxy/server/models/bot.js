const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var AppSchema = new mongoose.Schema({
    bot_id: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    bot_jwt: {
        type: String,
        minlength: 5
    }
    // tokens: [{
    //     access: {
    //         type: String,
    //         required: true
    //     },
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }]
});

AppSchema.methods.toJSON = function () {
    var bot = this;
    var botObject = bot.toObject();

    return _.pick(botObject, ["_id", "bot_id","bot_jwt"]);
};

//modify this method to check tokem is valid and or get new token

AppSchema.methods.generateAuthToken = function () {
    var bot = this;
    var access = 'auth';
    var token = jwt.sign({_id: bot._id.toHexString(), access}, '123abc').toString();

    bot.tokens.push({access, token});

    return bot.save().then(() => {
        return token;
    });
};

AppSchema.statics.findByToken = function (botId) {
    var Bot = this;
    // var decoded;
    //
    // try {
    //     decoded = jwt.verify(token, '123abc');
    //
    // } catch (e) {
    //     // return new Promise((resolve, reject) =>{
    //     //    reject();
    //     // });
    //     return Promise.reject();
    //
    // }

    return Bot.findOne({
        'bot_id': botId
    });

};

var Bot = mongoose.model('Bot', AppSchema);

module.exports = { Bot};