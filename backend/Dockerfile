
# Stage 1: Build the application
FROM node:24-bookworm-slim AS build

WORKDIR /app

# Install OpenSSL
RUN apt-get update && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy backend source code and configuration
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript
RUN npm run build


# Stage 2: Production image
FROM node:24-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

# Install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled application
COPY --from=build --chown=node:node /app/dist ./dist

# Copy Prisma configuration and migrations
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/prisma ./prisma

# Run as non-root user
USER node

EXPOSE 3000

# Apply database migrations before starting the API
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node dist/server.js"]
