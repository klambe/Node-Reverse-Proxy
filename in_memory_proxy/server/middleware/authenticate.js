const {Bot} = require('../models/bot');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth-id');

    Bot.findByToken(token).then((bot) => {
        if (!bot) {
            console.log("no bot reject");
            return Promise.reject();//if rejected bot is not in cache
        }

        console.log("FOUND bot!");

        req.bot = bot;
        req.token = token;
        next();
    }).catch((e) => {
        console.log("Catch block");
        res.status(401).send();
    });
};

module.exports = {authenticate};