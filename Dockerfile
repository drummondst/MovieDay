FROM nginx:alpine
COPY frontend/index.html /usr/share/nginx/html/index.html
COPY pb_migrations/ /pb/pb_migrations