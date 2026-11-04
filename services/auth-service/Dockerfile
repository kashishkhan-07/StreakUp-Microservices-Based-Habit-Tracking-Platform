FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY shared ./shared
COPY services/auth-service ./services/auth-service

WORKDIR /app/services/auth-service

RUN npm install --omit=dev

EXPOSE 5001

CMD ["npm", "start"]
