FROM node:lts-stretch

ADD . ./docker

RUN npm run build

# Running the app
CMD [ "npm", "start" ]
