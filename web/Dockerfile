FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm i || true
COPY . .
CMD ["npm", "run", "dev", "--", "--host"]
