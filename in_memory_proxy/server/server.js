const express = require('express');
const bodyParser = require('body-parser');
const loki = require('lokijs');

const app = express();
const port = process.env.PORT || 3001;

//temp from test wwapp
var request = require("request");
var requestjs = require("request-json");


const WWS_URL = "https://api.watsonwork.ibm.com";
const AUTHORIZATION_API = "/oauth/token";

//declare in memory database
let db = new loki('loki.json');

//declare collection wwapps
let wwapp = db.addCollection('wwapps');


app.use(bodyParser.json());

app.post('/:space', (req, res) => {

    let wwapp_id_input = req.header('x-auth-id');
    let wwapp_secret_input = req.header('x-auth');

    let space = req.params.space;
    let ibm_key = null;

    let serach = wwapp.find( {'wwapp_id':wwapp_id_input} );

    console.log('serach length is: ' + serach.length);


    if (serach.length ===0) {
        console.log("No wwapp found");
        //return res.status(404).send();
        getJWTToken(wwapp_id_input, wwapp_secret_input, function (jwt) {
            console.log("got JWT! ");
            ibm_key = jwt;

            postMessageToSpace(ibm_key, space, req, function (success) {
                if (success) {
                    console.log("Success 200");
                    res.sendStatus(201);

                    //when successful I should save to database
                    wwapp.insert({
                        wwapp_id: wwapp_id_input,
                        wwapp_jwt: ibm_key
                    });

                    let user = wwapp.findObject({'wwapp_id':wwapp_id_input});

                    console.log("saved JWT: " + user.wwapp_jwt) ;

                    // wwapp.save();
                } else {
                    console.log("Failure 400!");
                    res.status(400).end();
                }
            });
        });
    } else {

        let user = wwapp.findObject({'wwapp_id':wwapp_id_input});
        ibm_key = user.wwapp_jwt;

        postMessageToSpace(ibm_key, space, req, function (success) {
            if (success) {
                console.log("Success 200");
                res.sendStatus(201);


            } else {
                console.log("Failure 400!");
                console.log('ID is: ', wwapp._id);

                wwapp.chain().find({ wwapp_id: wwapp_id_input }).remove();

                res.status(400).end();
            }
        });
    }
});

app.post('/:id/delete', (req, res) => {
    let id = req.params.id;

    let user = wwapp.findObject({'wwapp_id':id});
    console.log("found user: " + user);

    // wwapp.chain().find({ wwapp_id: id }).remove();
    wwapp.remove(user);

    let user2 = wwapp.findObject({'wwapp_id':id});
    console.log("Search user: " + user2);

    res.sendStatus(201);
});


//Get an authentication token
function getJWTToken(userid, password, callback) {
    // Build request options for authentication.
    console.log('ID: '+ userid);
    console.log('Secret: '+ password);
    console.log('enviroment variable test is: ' + process.env.KEVIN_TEST);
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
    request(authenticationOptions, function (err, response, authenticationBody) {

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
function postMessageToSpace(accessToken, SPACE_ID, req, callback) {
    var jsonClient = requestjs.createClient(WWS_URL);
    var urlToPostMessage = "/v1/spaces/" + SPACE_ID + "/messages";
    jsonClient.headers.jwt = accessToken;

    // Building the message
    var messageData = req.body;
    console.log('***');
    console.log('***');
    console.log(messageData);
    console.log('***');
    console.log('***');
    console.log('***');

    // Calling IWW API to post message
    console.log("Message Sending : ");


    jsonClient.post(urlToPostMessage, messageData, function (err, jsonRes, jsonBody) {
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