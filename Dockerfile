# Dockerfile para pegar meu front e meu back
FROM node:20-alpine AS base
WORKDIR /app

# front
FROM base AS builder-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM base AS final
WORKDIR /app

# instalar dependências do backend e do frontend
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# backend dependdendcia
WORKDIR /app/backend
RUN npm ci --production

# front dependend
WORKDIR /app/frontend
RUN npm ci --production

# codigos
WORKDIR /app
COPY backend ./backend
#COPY frontend ./.next ./frontend/.next 
COPY --from=builder-frontend /app/frontend/.next ./frontend/.next
COPY frontend/public ./frontend/public

#estava dando erro no prisma, entao para garantir q o prisma rode corretamente onde for, alteraçao no docker build
WORKDIR /app/backend
RUN npx prisma generate

# porta do backe do front
EXPOSE 3030 3000

# variaveis de ambiente
ENV NEXT_PUBLIC_API_URL=http://localhost:3030

# Comando final: usar concurrently para rodar backend e frontend juntos
WORKDIR /app
CMD ["sh", "-c", "npx concurrently --kill-others \"cd backend && npm run start\" \"cd frontend && npm run start\""]
