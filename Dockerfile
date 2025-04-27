# Etapa 1: Build da aplicação
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Etapa 2: Imagem final para produção
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "dist/server.js"]
