FROM node:lts-buster-slim AS build

WORKDIR /app

COPY package*json /app/
RUN npm install -g npm@8
RUN npm install

COPY . /app/
RUN cd utils && ./mk_bubbles.sh

RUN npm run build

FROM node:lts-buster-slim

WORKDIR /app

COPY package*json /app/
RUN npm install -g npm@8
RUN npm install

COPY  --from=build /app/dist dist

ENV NODE_ENV=production

ENTRYPOINT [ "node", "/app/dist/budgetkey/server/server.mjs" ]
