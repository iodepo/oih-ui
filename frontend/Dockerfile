FROM node:18-alpine3.15

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install --legacy-peer-deps

COPY ./ ./

CMD ["npm", "start"]
