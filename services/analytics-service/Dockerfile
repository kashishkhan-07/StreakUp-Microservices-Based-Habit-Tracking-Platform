FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY shared ./shared
COPY services/analytics-service ./services/analytics-service

WORKDIR /app/services/analytics-service

RUN npm install --omit=dev

EXPOSE 5003

CMD ["npm", "start"]
