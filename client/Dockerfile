FROM node:19-alpine3.16

WORKDIR /usr/app

COPY package.json ./
COPY package-lock.json ./

RUN npm config set strict-ssl false
RUN npm install -qy

COPY . . 
EXPOSE 8000

CMD ["npm", "start"]