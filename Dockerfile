FROM ghcr.io/muchobien/pocketbase:latest

COPY pb_migrations /pb/pb_migrations

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

FROM nginx:alpine
COPY frontend/index.html /usr/share/nginx/html/index.html