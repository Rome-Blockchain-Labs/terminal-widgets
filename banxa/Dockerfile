FROM node:16-alpine AS deps
RUN apk add git
RUN apk add --no-cache libc6-compat
RUN apk add --update openssh

ENV PORT 3000
WORKDIR /app
COPY . .
ARG BANXA_API_KEY
ENV BANXA_API_KEY=romeblockchain@2022test
ARG BANXA_API_SECRET=
ENV BANXA_API_SECRET=IEYNDFWJ3nRn4oM50onnIDL8t0LKsCYt
ARG BANXA_DOMAIN
ENV BANXA_DOMAIN=https://romeblockchain.banxa-sandbox.com
ARG SECRET=
ENV SECRET=9102aljsdadasd0921jlaskjdalkj!!21jaslkd213asdajlj

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