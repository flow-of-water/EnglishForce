FROM node:22-alpine

WORKDIR /usr/src/app

# Cài deps trước để cache tốt hơn
COPY package*.json ./
RUN npm ci || npm install
RUN npm install -g nodemon

# Copy code
COPY . .

EXPOSE 5000
# Dev: bạn đang chạy "node server.js"
CMD ["nodemon", "server.js"]
