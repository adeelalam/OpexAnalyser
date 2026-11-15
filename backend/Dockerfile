
# Stage 1: Build the application
FROM node:24-bookworm-slim AS build

WORKDIR /app

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

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled application
COPY --from=build --chown=node:node /app/dist ./dist

# Run as non-root user
USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]
