FROM node:lts-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
ENTRYPOINT [ "node", "./first_init/recursive_data_entry.js" ]