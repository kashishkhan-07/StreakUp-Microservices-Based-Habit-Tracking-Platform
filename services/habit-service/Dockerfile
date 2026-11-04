FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY shared ./shared
COPY services/habit-service ./services/habit-service

WORKDIR /app/services/habit-service

RUN npm install --omit=dev

EXPOSE 5002

CMD ["npm", "start"]
