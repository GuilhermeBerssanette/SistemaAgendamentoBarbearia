FROM node:20.11.1-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g @angular/cli@17

RUN npm install --legacy-peer-deps

CMD ["ng", "serve", "--host", "0.0.0.0"]
