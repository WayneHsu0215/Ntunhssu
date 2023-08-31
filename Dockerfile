# 使用Alpine Linux作為基本映像
FROM node:18-alpine

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json 到工作目錄
COPY package*.json ./

# 安裝依賴項
RUN npm install

# 複製其他來源碼到工作目錄
COPY . .

EXPOSE 3000
# 建構 Vite 應用程式
RUN npx vite build

ENV NODE_ENV=production

# 使用產品模式啟動伺服器
CMD ["npm", "start"]

