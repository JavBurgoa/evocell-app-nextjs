ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
FROM node:lts-gallium


RUN echo $AWS_ACCESS_KEY_ID > /tmp/a && cat /tmp/a
ADD . ./app
WORKDIR /app

RUN npm install && npm run build

# Running the app
CMD [ "npm", "start" ]
