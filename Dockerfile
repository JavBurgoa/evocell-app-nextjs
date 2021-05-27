FROM node:lts-stretch

ADD . ./app
WORKDIR /app

COPY package.json ./
RUN npm install

RUN npm run build

# Running the app
CMD [ "npm", "start" ]
