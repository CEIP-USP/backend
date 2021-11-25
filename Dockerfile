FROM node:15.8.0-alpine

ENV PORT=3333 \
    APP_PATH=/usr/src/app

WORKDIR ${APP_PATH}

EXPOSE ${PORT}

COPY package* ./

CMD npm run dev

RUN npm install

COPY . ./