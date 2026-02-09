#!/bin/sh
set -e

# Sustituir variables de entorno en config.js
envsubst '${AUTH_SERVER_URL} ${API_GATEWAY_URL}' < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js

# Iniciar nginx
exec "$@"
