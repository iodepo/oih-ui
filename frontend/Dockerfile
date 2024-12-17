FROM node:lts-alpine3.19

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install --legacy-peer-deps

COPY ./ ./

CMD ["nodemon", "start"]
