FROM node:18-alpine as node

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json .

RUN npm pkg delete scripts.prepare
# --ignore-scripts ne marche pas, il empêche l'installation de bcrypt
RUN HUSKY=0 npm ci --only=production 

COPY . .

# REDACTED
EXPOSE 3000

CMD ["npm", "start"]