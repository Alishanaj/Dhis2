FROM node:16-alpine
WORKDIR /app

COPY ./ /app/

RUN npm ci
ENTRYPOINT [ "node", "./first_init/recursive_data_entry.js" ]