endpoint for app
https://ancient-brook-40940.herokuapp.com/


https://docs.mongodb.com/manual/reference/connection-string/

Step 1 Mongo db connection to heroku mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]

RUN COMMAND heroku config:get MONGODB_URI This will return all information needed to connect to the mongodb database


