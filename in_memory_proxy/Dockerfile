FROM node:9.4.0-alpine



# Create app directory
WORKDIR /memoryProxy

COPY package*.json ./

RUN npm install &&\
    apk update &&\
    apk upgrade

COPY . .

EXPOSE 3001

CMD [ "npm", "start" ]

#FROM node:9.4.0-alpine
#COPY app.js .
#COPY package.json .
#RUN npm install &&\
#    apk update &&\
#    apk upgrade
#EXPOSE  8080
#CMD node app.js

