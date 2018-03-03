FROM node:7

EXPOSE 3001

# Create app directory
WORKDIR /memoryProxy

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]