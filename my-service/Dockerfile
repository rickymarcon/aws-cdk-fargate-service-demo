FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json tsconfig.json ./

RUN npm ci

# Bundle app source
COPY src src

# Build service
RUN npm run build

EXPOSE 80

CMD ["npm", "start"]
