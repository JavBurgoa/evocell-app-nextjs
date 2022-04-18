FROM node:lts-gallium

ADD . ./app
WORKDIR /app

# Running the app
CMD [ "npm", "start" ]
