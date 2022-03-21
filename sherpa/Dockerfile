FROM node:16-alpine AS deps
RUN apk add git
RUN apk add --no-cache libc6-compat
RUN apk add --update openssh

ENV PORT 3000
WORKDIR /app
COPY . .
ARG NEXT_PUBLIC_USE_TESTNET=
ENV NEXT_PUBLIC_USE_TESTNET=$NEXT_PUBLIC_USE_TESTNET
RUN printenv >> build.env
RUN yarn install && yarn build

FROM node:16-alpine AS runner
WORKDIR /app
COPY --from=deps /app/build.env ./
COPY --from=deps /app/public ./public
COPY --from=deps /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json


EXPOSE 3000

CMD yarn start 