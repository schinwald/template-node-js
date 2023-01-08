FROM node:19.2.0-alpine AS base

RUN npm install -g npm@9.2.0

# Install dependencies
FROM base AS installer

WORKDIR /app

COPY ./package.json ./package-lock.json ./

RUN npm install --quiet


# Build necessary files
FROM base AS builder

WORKDIR /app

COPY --from=installer /app/package.json /app/package-lock.json ./
COPY --from=installer /app/node_modules ./node_modules
COPY ./tsconfig.json ./
COPY ./src ./src

RUN npm run build


# Added development features from builder
FROM base AS development

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json /app/tsconfig.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/src ./src
COPY ./nodemon.json ./

USER root


# Added deployment features from builder
FROM base AS deployment

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json /app/tsconfig.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/src ./src

USER root