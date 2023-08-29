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

# 暴露需要的端口，假設你的應用程序運行在3000端口上
EXPOSE 3000

# 定義預設的運行命令
CMD ["npm", "start"]

