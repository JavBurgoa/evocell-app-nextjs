FROM node:lts-stretch

#RUN echo "192.168.210.82 s3.embl.de" > /etc/hosts

ADD . ./app
WORKDIR /app

COPY package.json ./
RUN npm install

RUN npm run build

# Running the app
CMD [ "npm", "start" ]
