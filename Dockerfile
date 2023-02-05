FROM node:18-alpine

# ENV VARIABLES REDACTED
ENV PORT=3000
ENV MONGO_URI=mongodb://example:example@bj-mongodb:27017
ENV MARIADB_URI=mariadb://root:example@bj-mariadb:3306/battle_judge

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm pkg delete scripts.prepare
RUN HUSKY=0 npm ci --only=production

COPY . .

# REDACTED
EXPOSE 3000

CMD [ "npm", "start" ]