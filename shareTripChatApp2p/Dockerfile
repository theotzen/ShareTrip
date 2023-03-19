FROM node:19.6.0-alpine3.16

WORKDIR /usr/app

COPY package*.json ./
RUN npm install -qyg nodemon@2.0.7
RUN npm install -qy 

COPY . . 

CMD [ "npm", "start"]