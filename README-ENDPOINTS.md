# 🏥 API ENDPOINTS - SISTEMA DE FARMACIA

## 📋 **INFORMACIÓN GENERAL**

Este documento contiene todos los endpoints disponibles para el Sistema de Gestión de Farmacia. La aplicación utiliza una arquitectura de microservicios con autenticación JWT.

### 🚀 **Puertos de Servicios**

| Servicio | Puerto Directo | A través de Gateway |
|----------|---------------|-------------------|
| API Gateway | - | 8080 |
| Auth Server | 9000 | - |
| Catálogo Service | 8081 | 8080/api/catalogo |
| Inventario Service | 8082 | 8080/api/inventario |
| Ventas Service | 8083 | 8080/api/ventas |
| Frontend | 3001 | - |
| Frontend React | 3000 | - |

---

## 🔐 **1. SERVIDOR DE AUTENTICACIÓN**
**Puerto: 9000**
**Base URL: `http://localhost:9000`**

### **Obtener Token JWT**
```http
POST /api/token
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```

**Usuarios disponibles:**
- `admin/admin` (rol: ADMIN)
- `user/user` (rol: USER)

**Respuesta exitosa:**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "roles": ["ADMIN"]
}
```

### **Página web para tokens**
```http
GET /api/oauth2/token
```
Interfaz web para generar tokens fácilmente.

---

## 🌐 **2. API GATEWAY (PUNTO DE ENTRADA PRINCIPAL)**
**Puerto: 8080**
**Base URL: `http://localhost:8080`**

**⚠️ NOTA IMPORTANTE:** Todos los endpoints que requieren autenticación deben incluir:
```
Authorization: Bearer {tu_jwt_token}
```

---

## 📦 **3. SERVICIO DE CATÁLOGO (PRODUCTOS)**

### **Listar todos los productos**
```http
GET /api/catalogo/productos
Authorization: Bearer {token}
```

### **Obtener producto por ID**
```http
GET /api/catalogo/productos/{id}
Authorization: Bearer {token}
```

### **Crear nuevo producto**
```http
POST /api/catalogo/productos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Aspirina 500mg",
  "descripcion": "Analgésico para dolores leves y moderados",
  "precio": 15.50
}
```

### **Actualizar producto**
```http
PUT /api/catalogo/productos/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Aspirina 500mg Actualizada",
  "descripcion": "Analgésico mejorado para dolores leves y moderados",
  "precio": 18.00
}
```

### **Eliminar producto**
```http
DELETE /api/catalogo/productos/{id}
Authorization: Bearer {token}
```

---

## 📊 **4. SERVICIO DE INVENTARIO**

### **Listar todo el inventario**
```http
GET /api/inventario/inventario
Authorization: Bearer {token}
```

### **Obtener inventario por producto**
```http
GET /api/inventario/inventario/{productoId}
Authorization: Bearer {token}
```

### **Obtener detalle completo de inventario**
```http
GET /api/inventario/inventario/{productoId}/detalle
Authorization: Bearer {token}
```
*Incluye información del producto desde el servicio de catálogo*

### **Crear entrada de inventario**
```http
POST /api/inventario/inventario
Authorization: Bearer {token}
Content-Type: application/json

{
  "productoId": 1,
  "stock": 100
}
```

### **Actualizar stock**
```http
PUT /api/inventario/inventario/{productoId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "stock": 50
}
```

### **Eliminar entrada de inventario**
```http
DELETE /api/inventario/inventario/{productoId}
Authorization: Bearer {token}
```

---

## 💰 **5. SERVICIO DE VENTAS**

### **Listar todas las ventas**
```http
GET /api/ventas/ventas
Authorization: Bearer {token}
```

### **Obtener venta por ID**
```http
GET /api/ventas/ventas/{id}
Authorization: Bearer {token}
```

### **Obtener detalle completo de venta**
```http
GET /api/ventas/ventas/{id}/detalle
Authorization: Bearer {token}
```
*Incluye información detallada con datos de productos*

### **Crear nueva venta**
```http
POST /api/ventas/ventas
Authorization: Bearer {token}
Content-Type: application/json

{
  "cliente": "Juan Pérez",
  "total": 125.50,
  "fecha": "2026-01-30T10:30:00",
  "detalles": [
    {
      "productoId": 1,
      "cantidad": 2,
      "precioUnitario": 15.50
    },
    {
      "productoId": 2,
      "cantidad": 1,
      "precioUnitario": 94.50
    }
  ]
}
```

### **Actualizar venta**
```http
PUT /api/ventas/ventas/{id}
Authorization: Bearer {token}
Content-Type: application/json
```
*Usar el mismo formato que crear venta*

### **Eliminar venta**
```http
DELETE /api/ventas/ventas/{id}
Authorization: Bearer {token}
```

---

## 🔍 **6. ENDPOINTS DE MONITOREO**

### **Health Check del API Gateway**
```http
GET /actuator/health
```

### **Información del API Gateway**
```http
GET /actuator/info
```

---

## 📱 **7. COLECCIÓN DE POSTMAN**

### **Variables de Entorno Recomendadas:**
```json
{
  "base_url": "http://localhost:8080",
  "auth_url": "http://localhost:9000",
  "token": ""
}
```

### **Configuración de Authorization:**
- **Type:** Bearer Token
- **Token:** `{{token}}`

---

## 🎯 **8. FLUJO RECOMENDADO PARA PRUEBAS**

1. **🔑 Autenticación**
   ```
   POST {{auth_url}}/api/token
   ```

2. **📦 Crear Productos**
   ```
   POST {{base_url}}/api/catalogo/productos
   ```

3. **📊 Agregar Inventario**
   ```
   POST {{base_url}}/api/inventario/inventario
   ```

4. **💰 Realizar Ventas**
   ```
   POST {{base_url}}/api/ventas/ventas
   ```

5. **🔍 Consultar Datos**
   ```
   GET {{base_url}}/api/{servicio}/*
   ```

---

## 🏗️ **9. ARQUITECTURA DEL SISTEMA**

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Frontend React │
│   (Port 3001)   │    │   (Port 3000)   │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          └──────────┬───────────┘
                     │
           ┌─────────▼─────────┐
           │   API Gateway     │
           │   (Port 8080)     │
           └─────────┬─────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
┌────────▼────┐ ┌────▼────┐ ┌───▼─────┐
│  Catálogo   │ │Inventario│ │ Ventas  │
│ (Port 8081) │ │(Port 8082)│ │(Port 8083)│
└─────────────┘ └──────────┘ └─────────┘
         │           │           │
         └───────────┼───────────┘
                     │
            ┌────────▼────────┐
            │   Services DB   │
            │   (PostgreSQL)  │
            └─────────────────┘

      ┌─────────────────┐    ┌─────────────────┐
      │   Auth Server   │    │    Auth DB      │
      │   (Port 9000)   ├────┤   (PostgreSQL)  │
      └─────────────────┘    └─────────────────┘
```

---

## ⚙️ **10. COMANDOS DE DESPLIEGUE**

### **Iniciar todos los servicios:**
```bash
docker-compose up -d
```

### **Ver logs:**
```bash
docker-compose logs -f
```

### **Detener servicios:**
```bash
docker-compose down
```

### **Reconstruir servicios:**
```bash
docker-compose up --build -d
```

---

## 📞 **11. INFORMACIÓN DE CONTACTO Y TROUBLESHOOTING**

### **URLs de acceso directo:**
- **Frontend Principal:** http://localhost:3000
- **Frontend Alternativo:** http://localhost:3001
- **API Gateway:** http://localhost:8080
- **Auth Server:** http://localhost:9000
- **Generador de Tokens:** http://localhost:9000/api/oauth2/token

### **Problemas comunes:**
1. **Error 401:** Token expirado o inválido → Generar nuevo token
2. **Error 503:** Servicio no disponible → Verificar que Docker esté ejecutándose
3. **Error de conexión:** Puerto ocupado → Verificar puertos en docker-compose.yml

---

*📅 Última actualización: 30 de enero de 2026*