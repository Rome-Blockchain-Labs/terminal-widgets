FROM node:lts AS builder

#RUN apk add --update --no-cache python3 git openssh
RUN apk add --update openssh git
WORKDIR /usr/app
COPY . .
ARG REACT_APP_RUN_V2=
ENV REACT_APP_RUN_V2=$REACT_APP_RUN_V2
ARG REACT_APP_CHAIN_ID=
ENV REACT_APP_CHAIN_ID=$REACT_APP_CHAIN_ID
ARG PUBLIC_URL=
ENV PUBLIC_URL=$PUBLIC_URL

RUN rm -rf node_modules
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:16-alpine AS runner
WORKDIR /app
COPY --from=builder /usr/app/build ./build
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/package.json ./package.json

EXPOSE 3000

# CMD yarn start
CMD yarn serve build -s
