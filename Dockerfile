FROM node:lts-stretch

ADD . ./app
WORKDIR /app
RUN apt-get install -y nasm zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install

RUN npm run build

# Running the app
CMD [ "npm", "start" ]
