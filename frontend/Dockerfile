# 使用官方 Nginx 映像檔作為基礎
FROM nginx:stable-alpine

# 將 Vue.js 編譯後的靜態檔案複製到 Nginx 的服務目錄
# 確保在執行 docker build 前，您已經執行了 `npm run build`
COPY dist /usr/share/nginx/html

# 複製自定義的 Nginx 配置檔
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露 Nginx 的 HTTP 埠
EXPOSE 80

# 啟動 Nginx 服務
CMD ["nginx", "-g", "daemon off;"]