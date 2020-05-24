FROM node:14-alpine

RUN apk add --no-cache bash

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]