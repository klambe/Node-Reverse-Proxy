const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {App} = require('./../../models/app');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const my_apps = [{
    _id: userOneId,
    app_id: "fe621e95-f906-42ce-8a13-af18598ed376",
    app_secret: "4qrESZ6e1nXdPAN94Qaur_hCIfhd",
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, '123abc').toString()
    }]

}, {
    _id: userTwoId,
    app_id: "notAvalidAppID",
    app_secret: "bad_Secret",
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, '123abc').toString()
    }]
}];






const populateApps = (done) => {
    App.remove({}).then(() => {
        var appOne = new App(my_apps[0]).save();
        var appTwo = new App(my_apps[1]).save();

        return Promise.all([appOne, appTwo]);

    }).then(() => done());
};


module.exports = { my_apps, populateApps};