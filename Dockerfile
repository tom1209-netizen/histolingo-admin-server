# Fetching the latest node image on apline linux
FROM node:alpine AS builder

# Setting up the work directory
WORKDIR /app

EXPOSE 3000
EXPOSE 80
EXPOSE 443

# Copying all the files in our project
COPY . .

RUN npm install

ENTRYPOINT [ "npm", "run", "dev" ]