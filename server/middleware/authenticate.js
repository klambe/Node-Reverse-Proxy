const {Bot} = require('../models/bot');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth-id');

    Bot.findByToken(token).then((bot) => {
        if (!bot) {
            return Promise.reject();//if rejected bot is not in cache
        }

        req.bot = bot;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();
    });
};

module.exports = {authenticate};