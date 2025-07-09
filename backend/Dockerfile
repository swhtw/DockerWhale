# 使用官方 Node.js 20 LTS 映像作為基礎。
# 選擇一個適合你專案的 Node.js 版本。
FROM node:20-alpine

# 設定工作目錄。所有的後續指令都會在這個目錄下執行。
WORKDIR /app

# 將 package.json 和 package-lock.json (或 yarn.lock) 複製到工作目錄。
# 這樣做可以利用 Docker 的層快取，如果依賴沒有改變，就不會重新安裝。
COPY package*.json ./

# 安裝專案依賴。
# 使用 npm ci 以確保安裝版本與 package-lock.json 一致，這對於 CI/CD 很有用。
# 如果你使用 yarn，請替換為 `yarn install --frozen-lockfile`。
RUN npm ci

# 將所有應用程式程式碼複製到工作目錄。
# 注意：這會將你的整個 backendNodejs 資料夾複製到 /app。
# 如果你的 index.js 在 backendNodejs 資料夾內，確保路徑正確。
COPY . .

# 如果你的應用程式需要監聽特定的埠，請將其暴露。
# 你的 Node.js 應用程式在 3000 埠上運行。
EXPOSE 3000

# 定義容器啟動時執行的命令。
# 這裡假設你的主入口檔案是 index.js。
# 確保這個路徑與你的專案結構相符。
CMD ["node", "index.js"]