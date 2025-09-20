# 1. Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# 2. Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Set the default database URL for the container
ENV DATABASE_URL="file:/app/dev.db"

# Add NextAuth variables with default empty values
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Globally install Prisma CLI
RUN npm install -g prisma

EXPOSE 3000
CMD ["sh", "-c", "prisma migrate deploy && npm start"]
