FROM nginx:alpine
COPY frontend/index.html /usr/share/nginx/html/index.html

FROM ghcr.io/muchobien/pocketbase:latest
COPY pb_migrations /pb/pb_migrations