FROM node:7

EXPOSE 3001

# Create app directory
WORKDIR /proxy

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]