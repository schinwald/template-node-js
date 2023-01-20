FROM node:19.2.0-alpine AS base

RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake

RUN npm install -g npm@9.3.1

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
COPY ./tests ./tests

RUN npm run build


# Add testing files from builder
FROM base AS tests

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json /app/tsconfig.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build/src ./build/src
COPY --from=builder /app/build/tests ./build/tests
COPY --from=builder /app/src ./src
COPY --from=builder /app/tests ./tests

RUN npm run tests


# Add development files from builder
FROM base AS development

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json /app/tsconfig.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build/src ./build/src
COPY --from=builder /app/src ./src
COPY ./nodemon.json ./

USER root


# Add deployment files from builder
FROM base AS deployment

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json /app/tsconfig.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build/src ./build/src
COPY --from=builder /app/src ./src

USER root