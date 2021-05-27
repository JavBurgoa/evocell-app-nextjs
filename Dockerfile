FROM node:6.14

WORKDIR D:\Gnoseología Sitiana\EMBL\Bioinformatics\Interface\evocell-app-nextjs\
RUN mkdir ./docker

COPY . ./docker

RUN npm run build

# Running the app
CMD [ "npm", "start" ]
