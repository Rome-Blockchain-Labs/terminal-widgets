# Source: https://cloud.google.com/community/tutorials/deploy-react-nginx-cloud-run

# build environment
FROM node:16.13.1-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

RUN apk add --no-cache git

# Install depends on chart-setup.sh and charting library directory
COPY package*.json *yarn.lock ./
RUN yarn install

COPY . ./

#RUN npm install react-scripts@4.0.3 -g --silent
ARG REACT_APP_INFURA_KEY=
ENV REACT_APP_INFURA_KEY=$REACT_APP_INFURA_KEY
ARG REACT_APP_FORTMATIC_KEY=
ENV REACT_APP_FORTMATIC_KEY=$REACT_APP_FORTMATIC_KEY
ARG REACT_APP_GOOGLE_ANALYTICS_ID=
ENV REACT_APP_GOOGLE_ANALYTICS_ID=$REACT_APP_GOOGLE_ANALYTICS_ID

RUN yarn build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]