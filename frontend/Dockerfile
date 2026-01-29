FROM nginx:1.25-alpine

# Instalar envsubst
RUN apk add --no-cache gettext

# Copiar archivos del frontend
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js

# Copiar y hacer ejecutable el script de entrada
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copiar template de configuración
COPY config.js.template /usr/share/nginx/html/config.js.template

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
