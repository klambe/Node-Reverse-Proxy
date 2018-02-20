const {Bot: WWApp} = require('../models/wwapp');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth-id');

    WWApp.findByToken(token).then((wwapp) => {
        if (!wwapp) {
            console.log("no wwapp reject");
            return Promise.reject();//if rejected wwapp is not in cache
        }

        console.log("FOUND wwapp!");

        req.wwapp = wwapp;
        req.token = token;
        next();
    }).catch((e) => {
        console.log("Catch block");
        res.status(401).send();
    });
};

module.exports = {authenticate};