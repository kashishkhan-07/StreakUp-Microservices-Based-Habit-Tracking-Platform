FROM node:20-alpine

WORKDIR /app

# Copy root package and shared event contracts
COPY package*.json ./
COPY shared ./shared

# Copy gateway service
COPY services/api-gateway ./services/api-gateway

WORKDIR /app/services/api-gateway

RUN npm install --omit=dev

EXPOSE 5000

CMD ["npm", "start"]
