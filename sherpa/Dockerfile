FROM node:16-alpine AS deps
RUN apk add git

RUN apk add --no-cache libc6-compat
ENV PORT 3000

ARG NEXT_USE_TESTNET=
ENV NEXT_USE_TESTNET=$NEXT_USE_TESTNET


RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app


COPY package*.json /usr/src/app/
RUN yarn

FROM node:16-alpine AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . /usr/src/app


RUN  yarn build
EXPOSE 3000

CMD "yarn" "run" "start"