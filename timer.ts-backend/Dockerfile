FROM node:18 AS builder

WORKDIR /src
COPY . /src
RUN npm install
RUN npm run build


FROM node:18

WORKDIR /src
COPY --from=builder /src/dist /src
COPY --from=builder /src/node_modules /src/node_modules
CMD node index.js
