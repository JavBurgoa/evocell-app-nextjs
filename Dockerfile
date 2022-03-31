FROM node:lts-gallium

ADD . ./app
WORKDIR /app

RUN npm install && npm run build

# Running the app
CMD [ "npm", "start" ]
