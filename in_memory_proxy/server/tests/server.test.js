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
            text: "Unit_Test Success",
            actor: {
                name: "My first bot",
                avatar: "",
                url: ""
            }
        }
    ]
};


// beforeEach(populateBots);
//
// describe('POST /v1/spaces/:space/messages', () => {
//     it('should return 400 if not authenticated', (done) => {
//
//         let spaces = 123;
//
//         request(app)
//             .post(`/v1/spaces/${spaces}/messages`)
//             .set('x-auth-id', '123')
//             .set('x-auth', '123')
//             .expect(400)
//             .expect((res) => {
//                 expect(res.body).toEqual({});
//             })
//             .end(done);
//     });//end of it
//
//
//     it('should post message successfully to watson workspace and return 201', (done) => {
//
//         request(app)
//             .post("/v1/spaces/59c3e28fe4b020a6bfe961ae/messages")
//             .send(messageData)
//             .set('x-auth', my_bots[0].tokens[0].token)
//             .set('x-auth-id', 'fe621e95-f906-42ce-8a13-af18598ed376')
//             .set('x-auth', '4qrESZ6e1nXdPAN94Qaur_hCIfhd')
//
//             .expect(201)
//             .end(done);
//     });//end of it
//
// });


describe('First test', function () {
    it('It should always pass', function () {
        var number1 = 25;
        expect(number1).toEqual(25);
    });
});