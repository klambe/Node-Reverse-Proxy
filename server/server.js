const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Bot} = require('./models/bot');
const {authenticate} = require('./middleware/authenticate');


const app = express();
const port = process.env.PORT || 3001;

//temp from test bot
var request = require("request");
var requestjs = require("request-json");



const WWS_URL = "https://api.watsonwork.ibm.com";
const AUTHORIZATION_API = "/oauth/token";

app.use(bodyParser.json());


app.post('/v1/spaces/:space/messages', (req, res) => {

    let bot_id = req.header('x-auth-id');
    let bot_secret = req.header('x-auth');




    let space = req.params.space;

    // Build your name from the incoming JSON
    // var myMsg = req.body.fname + " " + req.body.lname;

    getJWTToken(bot_id, bot_secret, function(jwt) {
        console.log("got JWT! ");

        postMessageToSpace( jwt,space, req, function(success) {
            if (success) {
                console.log("Success 200");
                res.sendStatus(201);

                //when successful I should save to database

                var bot = new Bot({
                    bot_id: bot_id,
                    bot_jwt: jwt
                });

                bot.save();

            } else {
                console.log("Failure 400!");
                res.status(400).end();
            }
        })
    });
});



//Get an authentication token
function getJWTToken(userid, password, callback) {
    // Build request options for authentication.
    const authenticationOptions = {
        "method": "POST",
        "url": `${WWS_URL}${AUTHORIZATION_API}`,
        "auth": {
            "user": userid,
            "pass": password
        },
        "form": {
            "grant_type": "client_credentials"
        }
    };

    // Get the JWT Token
    request(authenticationOptions, function(err, response, authenticationBody) {

        // If successful authentication, a 200 response code is returned
        if (response.statusCode !== 200) {
            // if our app can't authenticate then it must have been
            // disabled. Just return
            console.log("ERROR: App can't authenticate");
            callback(null);
        }
        const accessToken = JSON.parse(authenticationBody).access_token;
        callback(accessToken);
    });
}

//Post a message to a space
function postMessageToSpace( accessToken,SPACE_ID, req, callback) {
    var jsonClient = requestjs.createClient(WWS_URL);
    var urlToPostMessage = "/v1/spaces/" + SPACE_ID + "/messages";
    jsonClient.headers.jwt = accessToken;

    // Building the message
    var messageData = req.body;

    // Calling IWW API to post message
    console.log("Message Sending : ");



    jsonClient.post(urlToPostMessage, messageData, function(err, jsonRes, jsonBody) {
        if (jsonRes.statusCode === 201) {
            console.log("Message posted to IBM Watson Workspace successfully!");
            callback(true);
        } else {
            console.log("Error posting to IBM Watson Workspace !");
            console.log("Return code : " + jsonRes.statusCode);
            console.log(jsonBody);
            callback(false);
        }
    });
}

//starting app
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

module.exports = {app};
