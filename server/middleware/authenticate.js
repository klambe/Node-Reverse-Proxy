const {App} = require('./../models/app');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    App.findByToken(token).then((app) => {
        if (!app) {
            return Promise.reject();
        }
        req.app = app;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();
    });
};

module.exports = {authenticate};