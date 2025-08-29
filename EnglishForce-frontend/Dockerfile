FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci || npm install

COPY . .

# CRA mặc định 3000, nếu khác thì sửa lại
EXPOSE 3000

# Fix file-watching trên Docker/Windows
ENV CHOKIDAR_USEPOLLING=true

# Dev: bạn đang chạy "npm start"
CMD ["npm", "start"]
