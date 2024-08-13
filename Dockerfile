FROM node:21-alpine

RUN apk add --quiet --update --no-cache openjdk17-jre

RUN npm install -g @angular/cli@17 && npm install -g firebase-tools && npm install

WORKDIR /home/node/app

USER node

COPY . .

CMD ["ng", "serve", "--host", "0.0.0.0"]
