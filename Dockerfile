FROM node:lts-stretch

ADD . ./app
WORKDIR /app
RUN apt-get install -y nasm zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

RUN npm install && npm run build

# Running the app
CMD [ "npm", "start" ]
