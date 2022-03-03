# # Install dependencies only when needed
FROM node:16-alpine AS deps
RUN apk add git
# # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
ENV PORT 3000

# Create app directory
WORKDIR /app

# Installing dependencies
COPY package*.json /app
COPY . /app
RUN yarn install

RUN  yarn run build
EXPOSE 3000

CMD "yarn" "run" "start"