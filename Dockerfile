FROM alpine
RUN apk add nodejs npm bash
WORKDIR /usr/src/poc
COPY package*.json ./
COPY *.js ./
COPY *.env ./

EXPOSE 8001