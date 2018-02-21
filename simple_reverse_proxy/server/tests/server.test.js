const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');

//this is the App Model
const {Bot} = require('../models/wwapp');

const {my_bots, populateBots} = require('./seed/seed');

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
            text: "Unit_Test \nSuccess",
            actor: {
                name: "My first bot",
                avatar: "",
                url: ""
            }
        }
    ]
};


// beforeEach(populateBots);

describe('POST /:space', () => {

    it('should return 400 if not authenticated', (done) => {

        let spaces = 123;

        request(app)
            .post(`/${spaces}`)
            .set('x-auth-id', '123')
            .set('x-auth', '123')
            .expect(400)
            .end(done);
    });//end of it


    it('should post message successfully to watson workspace and return 201', (done) => {
        request(app)
            .post("/59c3e28fe4b020a6bfe961ae")
            .send(messageData)
            .set('x-auth-id', 'fe621e95-f906-42ce-8a13-af18598ed376')
            .set('x-auth', '4qrESZ6e1nXdPAN94Qaur_hCIfhd')
            .expect(201)
            .end(done);
    });//end of it

    it('should fail if space is not valid', (done) => {
        request(app)
            .post("/invalidSpace")
            .send(messageData)
            .set('x-auth-id', 'fe621e95-f906-42ce-8a13-af18598ed376')
            .set('x-auth', '4qrESZ6e1nXdPAN94Qaur_hCIfhd')
            .expect(400)
            .end(done);
    });//end of it

    it('should fail if wwapp id is not valid', (done) => {
        request(app)
            .post("/59c3e28fe4b045a6bfe961ae")
            .send(messageData)
            .set('x-auth-id', 'invalidAppId')
            .set('x-auth', '4qrESZ6e1nXdPAN94Qaur_hCIfhd')
            .expect(400)
            .end(done);
    });//end of it

    it('should fail if wwapp x-auth is not valid', (done) => {
        request(app)
            .post("/59c3e28fe4b045a6bfe961ae")
            .send(messageData)
            .set('x-auth-id', 'fe621e95-f906-42ce-8a13-af18598ed376')
            .set('x-auth', 'invalidXAuth')
            .expect(400)
            .end(done);
    });//end of it

    it('should fail if x-auth header not included', (done) => {
        request(app)
            .post("/59c3e28fe4b045a6bfe961ae")
            .send(messageData)
            .set('x-auth', '4qrESZ6e1nXdPAN94Qaur_hCIfhd')
            .expect(404)
            .end(done);
    });//end of it

    it('should fail if x-auth-id header not included ', (done) => {
        request(app)
            .post("/59c3e28fe4b045a6bfe961ae")
            .send(messageData)

            .set('x-auth-id', '4qrESZ6e1nXdPAN94Qaur_hCIfhd')
            .expect(404)
            .end(done);
    });//end of it

    it('should fail if x-auth and x-auth-id header not included ', (done) => {
        request(app)
            .post("/59c3e28fe4b045a6bfe961ae")
            .send(messageData)
            .expect(404)
            .end(done);
    });//end of it

});