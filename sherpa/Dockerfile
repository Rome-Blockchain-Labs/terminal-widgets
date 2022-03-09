FROM node:16-alpine AS deps
RUN apk add git
RUN apk add --no-cache libc6-compat

ENV PORT 3000
WORKDIR /app
COPY . .
ARG DOPPLER_TOKEN
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub
RUN echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories
RUN apk add doppler
RUN doppler secrets download --no-file --format env > build.env
RUN export $(cat build.env | xargs) && yarn install && yarn build

FROM node:16-alpine AS runner
WORKDIR /app
COPY --from=deps /app/build.env ./
COPY --from=deps /app/public ./public
COPY --from=deps /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json


EXPOSE 3000

CMD yarn start 