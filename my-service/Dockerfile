FROM node:12-alpine

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY src src

RUN npm ci

CMD ["npm", "start"]