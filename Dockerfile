FROM node:10

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV production

COPY package.json yarn.lock ./
RUN yarn --pure-lockfile
COPY . /usr/src/app

CMD [ "npm", "start" ]
