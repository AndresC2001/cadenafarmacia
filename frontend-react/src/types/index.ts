export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
}

export interface Inventario {
  productoId: number;
  stock: number;
}

export interface DetalleVenta {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface Venta {
  id?: number;
  cliente: string;
  total: number;
  detalles: DetalleVenta[];
}

export interface AuthResponse {
  accessToken: string;
}

export interface User {
  username: string;
  roles: string[];
}

export interface AppConfig {
  AUTH_SERVER_URL: string;
  API_GATEWAY_URL: string;
}
