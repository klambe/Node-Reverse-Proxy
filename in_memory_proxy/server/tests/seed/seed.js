const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Bot} = require('../../models/bot');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const my_bots = [{
    _id: userOneId,
    bot_id: "fe621e95-f906-42ce-8a13-af18598ed376",
    bot_jwt: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtaXNzaW9ucyI6WyJhc" +
    "HAiXSwic2NvcGUiOlsiYXBwIl0sImlkIjoiZmU2MjFlOTUtZjkwNi00MmNlLThhMTMtYWYxODU5OGVkMzc2IiwiZXhwIjoxNTE3MzM2NzY3LCJqdGkiOiI2MDQ4OTQxZS00ODc5LTRkYTQtYWJkMi1iODMwMDMyZDRiZDAiLCJjbG" +
    "llbnRfaWQiOiJmZTYyMWU5NS1mOTA2LTQyY2UtOGExMy1hZjE4NTk4ZWQzNzYifQ.jT4IeLqiK18aSnPc2s0xTz3BmTwIs-R-Y10zN9ZNWeOOHtYsnlnTLV7BA4nxbPO320xnr2ggVoA8j2mmf3X_rV_ofBZuAySOMVnKYPgEeyw3c1JJo" +
    "Wkb91A6TLeVuZYVNu35bimdYOPO9XnnPA2--xcHfLY7b4yGyIJZ8IGRN9GOUMh__XfKwEKBBEFAbDhnU3xwZiLGhxTPpEAoMd9jD5xld9pdkvsTsrhDDWQNvRHtMQ-VMv8jjW7QCXn-1e6WC1yzBQLz538dUexiYfvmqjB4r4JtvcS4hUvViwAbFquILhJdKh0qXcrC7lhvFv8SYL2Lc2oUkYmq_W6eE6cn2A"

}, {
    _id: userTwoId,
    bot_id: "notAvalidAppID",
    bot_jwt: "bad_Secret"
}];






const populateBots = (done) => {
    Bot.remove({}).then(() => {
        var botOne = new Bot(my_apps[0]).save();
        var botTwo = new Bot(my_apps[1]).save();

        return Promise.all([botOne, botTwo]);

    }).then(() => done());
};


module.exports = { my_bots, populateBots};