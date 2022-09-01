FROM node:16-alpine AS deps
RUN apk add git
RUN apk add --no-cache libc6-compat
RUN apk add --update openssh

ENV PORT 3000
WORKDIR /app
COPY . .
ARG BANXA_API_KEY
ENV BANXA_API_KEY=$BANXA_API_KEY
ARG BANXA_API_SECRET=
ENV BANXA_API_SECRET=$BANXA_API_SECRET
ARG BANXA_DOMAIN
ENV BANXA_DOMAIN=$BANXA_DOMAIN
ARG SECRET=
ENV SECRET=$SECRET
ARG NEXT_PUBLIC_RETURN_URL_ON_SUCCESS=
ENV NEXT_PUBLIC_RETURN_URL_ON_SUCCESS=$NEXT_PUBLIC_RETURN_URL_ON_SUCCESS


RUN printenv >> .env.production
RUN yarn install && yarn build

FROM node:16-alpine AS runner
WORKDIR /app
COPY --from=deps /app/.env.production ./
COPY --from=deps /app/public ./public
COPY --from=deps /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json


EXPOSE 3000

CMD yarn start 