FROM node:10-alpine

USER root
ADD ./src ./src
ADD ./tests ./tests
ADD ./package.json ./package.json
RUN npm config set unsafe-perm true 
RUN apk add python make gcc g++
RUN npm install

EXPOSE 3000
CMD npm run start:prod