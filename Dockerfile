FROM node:lts-stretch

ADD . ./app
WORKDIR /app

RUN npm install

RUN npm build

# Running the app
CMD [ "npm", "start" ]
