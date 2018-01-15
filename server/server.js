const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {App} = require('./models/app');
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

    let app_id = req.header('x-auth-id');
    let app_secret = req.header('x-auth');


    let space = req.params.space;


    getJWTToken(app_id, app_secret, function(jwt) {
        console.log("JWT Token :", jwt);

        postMessageToSpace( jwt,space, req, function(success) {
            if (success) {
                console.log("Success 200");
                res.sendStatus(201);
                //res.status(200).end();
                console.log("after response we want to store JWT in Database");

            } else {
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
    console.log("Message body : %s", JSON.stringify(messageData));



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
