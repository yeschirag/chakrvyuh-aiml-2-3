FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm i || true
COPY src ./src
CMD ["node", "src/index.js"]
