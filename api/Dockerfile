FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma/ ./
RUN npm run prisma:generate
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
