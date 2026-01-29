# Microservices System

Sistema simple de microservicios con Spring Boot para demostrar catálogo, inventario y ventas. Incluye un API Gateway con OAuth2 (Spring Authorization Server) y un frontend estático dockerizable.

## Servicios

- **Auth Server** (`auth-server`): OAuth2 Authorization Server con usuarios en PostgreSQL.
- **API Gateway** (`api-gateway`): expone `/api/**` y protege con JWT.
- **Catálogo** (`catalogo-service`): productos.
- **Inventario** (`inventario-service`): stock y consulta de producto desde catálogo.
- **Ventas** (`ventas-service`): ventas y detalles enriquecidos con catálogo e inventario.
- **Frontend** (`frontend`): interfaz básica en HTML/JS.

## Requisitos

- Docker + Docker Compose

## Levantar el sistema

```bash
docker compose up --build
```

Servicios expuestos:

- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Auth Server: http://localhost:9000

## Obtener token (Client Credentials)

```bash
curl -X POST http://localhost:9000/oauth2/token \
  -u gateway-client:gateway-secret \
  -d 'grant_type=client_credentials&scope=read'
```

La respuesta entrega un `access_token`. Úsalo como `Bearer` en el frontend o en llamadas directas al gateway.

Ejemplo:

```bash
curl http://localhost:8080/api/catalogo/productos \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Credenciales de demo (Auth Server)

Usuarios cargados vía `data.sql`:

- `admin` / `admin123`
- `user` / `user123`

## Endpoints principales

- Catálogo: `GET /api/catalogo/productos`
- Inventario: `GET /api/inventario/inventario`
- Ventas: `GET /api/ventas/ventas`
- Ventas detalle: `GET /api/ventas/ventas/{id}/detalle`

## Base de datos

- Un contenedor PostgreSQL para servicios con tres bases: `catalogo_db`, `inventario_db`, `ventas_db`.
- Un contenedor PostgreSQL para el auth server: `auth_db`.
