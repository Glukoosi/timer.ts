FROM node:18 AS builder

WORKDIR /src
COPY . /src
RUN npm install
RUN npm run build


FROM caddy:2

COPY --from=builder /src/dist /usr/share/caddy
