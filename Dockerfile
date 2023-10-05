FROM node:lts-buster-slim as build

WORKDIR /app

COPY package*json /app/
RUN npm install -g npm@8
RUN npm install

COPY . /app/

RUN npm run build:ssr

FROM node:lts-buster-slim

WORKDIR /app

COPY package*json /app/
RUN npm install -g npm@8
RUN npm install

COPY  --from=build /app/dist dist

ENTRYPOINT [ "node", "/app/dist/budgetkey/server/main.js" ]
