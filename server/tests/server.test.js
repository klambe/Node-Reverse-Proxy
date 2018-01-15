const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');

//this is the App Model
const {App} = require('./../models/app');

const {my_apps, populateApps} = require('./seed/seed');

// Building the message
let messageData = {
    type: "appMessage",
    version: 1.0,
    annotations: [
        {
            type: "generic",
            version: 1.0,
            color: "#00B6CB",
            title: "Hello ...",
            text: "Unit_Test Success",
            actor: {
                name: "My first bot",
                avatar: "",
                url: ""
            }
        }
    ]
};


beforeEach(populateApps);

describe('POST /v1/spaces/:space/messages', () => {
    it('should return 401 if not authenticated', (done) => {

        let spaces = 123;

        request(app)
            .post(`/v1/spaces/${spaces}/messages`)
            .set('x-auth', '123')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });//end of it


    it('should post message successfully to watson workspace and return 201', (done) => {

        request(app)
            .post("/v1/spaces/59c3e28fe4b020a6bfe961ae/messages")
            .send(messageData)
            .set('x-auth', my_apps[0].tokens[0].token)

            .expect(201)
            .end(done);
    });//end of it

});