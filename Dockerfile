FROM node:lts-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
ENTRYPOINT [ "node", "recursive_data_entry.js" ]