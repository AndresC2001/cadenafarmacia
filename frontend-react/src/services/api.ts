import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { AuthResponse, Producto, Inventario, Venta, AppConfig } from '../types';

class ApiService {
  private baseUrl: string;
  private authServerUrl: string;

  constructor() {
    const config = (window as any).CONFIG as AppConfig;
    this.authServerUrl = config?.AUTH_SERVER_URL || 'http://localhost:9000';
    this.baseUrl = config?.API_GATEWAY_URL || '/api';
    
    // Configurar axios interceptor para agregar token automáticamente
    axios.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = token.startsWith('Bearer') ? token : `Bearer ${token}`;
      }
      return config;
    });
  }

  getToken(): string {
    return localStorage.getItem('access_token') || '';
  }

  setToken(token: string): void {
    localStorage.setItem('access_token', token.trim());
  }

  clearToken(): void {
    localStorage.removeItem('access_token');
  }

  parseJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      return null;
    }
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await axios.post(
      `${this.authServerUrl}/api/token`,
      { username, password }
    );
    return response.data;
  }

  // Catálogo endpoints
  async getProductos(): Promise<Producto[]> {
    const response: AxiosResponse<Producto[]> = await axios.get(`${this.baseUrl}/catalogo/productos`);
    return response.data;
  }

  async createProducto(producto: Omit<Producto, 'id'>): Promise<Producto> {
    const response: AxiosResponse<Producto> = await axios.post(`${this.baseUrl}/catalogo/productos`, producto);
    return response.data;
  }

  async updateProducto(id: number, producto: Omit<Producto, 'id'>): Promise<Producto> {
    const response: AxiosResponse<Producto> = await axios.put(`${this.baseUrl}/catalogo/productos/${id}`, producto);
    return response.data;
  }

  async deleteProducto(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/catalogo/productos/${id}`);
  }

  // Inventario endpoints
  async getInventario(): Promise<Inventario[]> {
    const response: AxiosResponse<Inventario[]> = await axios.get(`${this.baseUrl}/inventario/inventario`);
    return response.data;
  }

  async createInventario(inventario: Inventario): Promise<Inventario> {
    const response: AxiosResponse<Inventario> = await axios.post(`${this.baseUrl}/inventario/inventario`, inventario);
    return response.data;
  }

  async updateInventario(productoId: number, inventario: Inventario): Promise<Inventario> {
    const response: AxiosResponse<Inventario> = await axios.put(`${this.baseUrl}/inventario/inventario/${productoId}`, inventario);
    return response.data;
  }

  async deleteInventario(productoId: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/inventario/inventario/${productoId}`);
  }

  // Ventas endpoints
  async getVentas(): Promise<Venta[]> {
    const response: AxiosResponse<Venta[]> = await axios.get(`${this.baseUrl}/ventas/ventas`);
    return response.data;
  }

  async createVenta(venta: Omit<Venta, 'id'>): Promise<Venta> {
    const response: AxiosResponse<Venta> = await axios.post(`${this.baseUrl}/ventas/ventas`, venta);
    return response.data;
  }

  async updateVenta(id: number, venta: Omit<Venta, 'id'>): Promise<Venta> {
    const response: AxiosResponse<Venta> = await axios.put(`${this.baseUrl}/ventas/ventas/${id}`, venta);
    return response.data;
  }

  async deleteVenta(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/ventas/ventas/${id}`);
  }
}

export const apiService = new ApiService();
